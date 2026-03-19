#!/usr/bin/env node
/**
 * inline-page.js — Creates a single self-contained HTML file from a Next.js static export page.
 *
 * Usage: node inline-page.js <page-path> [output-file]
 * Example: node inline-page.js /product/sony-a7-iv/257962 variant-detail.html
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'out');
const pagePath = process.argv[2];
const outputFile = process.argv[3] || 'standalone-page.html';

if (!pagePath) {
  console.error('Usage: node inline-page.js <page-path> [output-file]');
  console.error('Example: node inline-page.js /product/sony-a7-iv/257962 variant-detail.html');
  process.exit(1);
}

// Resolve the HTML file
const htmlPath = pagePath === '/'
  ? path.join(OUT_DIR, 'index.html')
  : path.join(OUT_DIR, pagePath.replace(/^\//, '') + '.html');

if (!fs.existsSync(htmlPath)) {
  console.error(`HTML not found: ${htmlPath}`);
  process.exit(1);
}

console.log(`Reading: ${htmlPath}`);
let html = fs.readFileSync(htmlPath, 'utf-8');

// ── Helper: read file from out dir ──
function readAsset(src) {
  // Remove leading slash
  const rel = src.replace(/^\//, '');
  const fullPath = path.join(OUT_DIR, rel);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8');
  }
  return null;
}

// ── Helper: convert image to base64 data URI ──
function imageToDataUri(src) {
  const rel = src.replace(/^\//, '');
  const fullPath = path.join(OUT_DIR, rel);
  if (!fs.existsSync(fullPath)) {
    // Try from public/images
    const pubPath = path.join(__dirname, 'public', rel);
    if (fs.existsSync(pubPath)) {
      const ext = path.extname(pubPath).slice(1).toLowerCase();
      const mime = ext === 'jpg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
      return `data:${mime};base64,${fs.readFileSync(pubPath).toString('base64')}`;
    }
    return null;
  }
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : ext === 'woff2' ? 'font/woff2' : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
}

// ── 1. Inline all CSS <link> tags ──
let cssCount = 0;
html = html.replace(/<link\s+rel="stylesheet"\s+href="(\/[^"]+\.css)"[^>]*>/g, (match, href) => {
  const css = readAsset(href);
  if (css) {
    cssCount++;
    // Also inline font references in CSS
    let inlinedCss = css.replace(/url\((\/[^)]+\.woff2?)\)/g, (m, fontUrl) => {
      const dataUri = imageToDataUri(fontUrl);
      return dataUri ? `url(${dataUri})` : m;
    });
    return `<style>${inlinedCss}</style>`;
  }
  return match;
});
console.log(`  Inlined ${cssCount} CSS file(s)`);

// ── 2. Collect all script src paths from the HTML ──
const scriptSrcs = [];
const scriptRegex = /<script\s+src="(\/[^"]+\.js)"[^>]*><\/script>/g;
let m;
while ((m = scriptRegex.exec(html)) !== null) {
  scriptSrcs.push(m[1]);
}

// ── 3. Also find any dynamically loaded chunks ──
// Next.js uses self.__next_f.push for RSC data - these reference chunk IDs
// We need to find and inline ALL js files that might be needed
const chunksDir = path.join(OUT_DIR, '_next/static/chunks');
let allChunks = [];
if (fs.existsSync(chunksDir)) {
  allChunks = getAllJsFiles(path.join(OUT_DIR, '_next/static'));
}

function getAllJsFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllJsFiles(full));
    } else if (item.name.endsWith('.js')) {
      results.push('/' + path.relative(OUT_DIR, full));
    }
  }
  return results;
}

// ── 4. Replace all <script src> with inline <script> ──
// First, replace explicitly referenced scripts
let jsCount = 0;
html = html.replace(/<script\s+src="(\/[^"]+\.js)"([^>]*)><\/script>/g, (match, src, attrs) => {
  const js = readAsset(src);
  if (js) {
    jsCount++;
    // Remove src-related attrs, keep others
    const cleanAttrs = (attrs || '').replace(/\s*async\s*=\s*"[^"]*"/g, '').replace(/\s*async/g, '').trim();
    return `<script${cleanAttrs ? ' ' + cleanAttrs : ''}>${js}</script>`;
  }
  return match;
});
console.log(`  Inlined ${jsCount} JS file(s)`);

// ── 5. Patch dynamic chunk loading to use inline data ──
// Next.js loads chunks dynamically via script tags. We need to intercept this.
// Build a map of all available chunks and inject them as a lookup
const chunkMap = {};
for (const chunkPath of allChunks) {
  // Skip chunks already inlined
  if (scriptSrcs.includes(chunkPath)) continue;
  const content = readAsset(chunkPath);
  if (content) {
    chunkMap[chunkPath] = content;
  }
}

const extraChunkCount = Object.keys(chunkMap).length;
if (extraChunkCount > 0) {
  // Inject a script that intercepts dynamic script loading
  const chunkLoader = `
<script>
// Standalone page: intercept dynamic chunk loading
(function() {
  var _chunks = {};
  ${Object.entries(chunkMap).map(([p, code]) => {
    // Escape the code for embedding in a string
    return `_chunks[${JSON.stringify(p)}] = function(){ ${code} };`;
  }).join('\n  ')}

  // Intercept createElement to catch dynamic script loading
  var origCreateElement = document.createElement.bind(document);
  document.createElement = function(tag) {
    var el = origCreateElement(tag);
    if (tag.toLowerCase() === 'script') {
      var origSetAttr = el.setAttribute.bind(el);
      el.setAttribute = function(name, value) {
        if (name === 'src' && _chunks[value]) {
          // Execute inline instead of loading
          setTimeout(function() {
            try { _chunks[value](); } catch(e) { console.warn('Chunk exec error:', value, e); }
            if (el.onload) el.onload();
          }, 0);
          return;
        }
        return origSetAttr(name, value);
      };
      // Also intercept .src setter
      Object.defineProperty(el, 'src', {
        set: function(value) {
          if (_chunks[value]) {
            setTimeout(function() {
              try { _chunks[value](); } catch(e) { console.warn('Chunk exec error:', value, e); }
              if (el.onload) el.onload();
            }, 0);
          } else {
            origSetAttr('src', value);
          }
        },
        get: function() { return el.getAttribute('src'); }
      });
    }
    return el;
  };
})();
</script>`;

  // Inject before the first <script> tag
  html = html.replace(/<script/, chunkLoader + '\n<script');
  console.log(`  Injected ${extraChunkCount} extra chunk(s) for dynamic loading`);
}

// ── 6. Inline images referenced in HTML ──
let imgCount = 0;
html = html.replace(/src="(\/images\/[^"]+)"/g, (match, src) => {
  const dataUri = imageToDataUri(src);
  if (dataUri) {
    imgCount++;
    return `src="${dataUri}"`;
  }
  return match;
});

// Also inline /_next/static/media/ assets (fonts, images)
html = html.replace(/(?:src|href)="(\/_next\/static\/media\/[^"]+)"/g, (match, src) => {
  const dataUri = imageToDataUri(src);
  if (dataUri) {
    imgCount++;
    return match.replace(src, dataUri);
  }
  return match;
});
console.log(`  Inlined ${imgCount} image/media asset(s)`);

// ── 7. Inline images in JS (for React components that reference /images/) ──
html = html.replace(/["'](\/images\/[^"']+)["']/g, (match, src) => {
  const dataUri = imageToDataUri(src);
  if (dataUri) {
    return match.replace(src, dataUri);
  }
  return match;
});

// ── 8. Disable client-side navigation (keep page self-contained) ──
// Add base tag and intercept link clicks
const navFix = `
<script>
// Keep navigation on current page - disable Next.js router pushes
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (link && link.href && !link.href.startsWith('#') && !link.href.startsWith('javascript:')) {
    // Allow same-page anchors, block navigation
    var url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname) {
      e.preventDefault();
      console.log('Navigation blocked (standalone page):', url.pathname);
    }
  }
});
</script>`;
html = html.replace('</body>', navFix + '\n</body>');

// ── 9. Write output ──
const outputPath = path.resolve(outputFile);
fs.writeFileSync(outputPath, html);
const sizeMB = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1);
console.log(`\n✅ Standalone page created: ${outputPath} (${sizeMB} MB)`);
