const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const PORT = 3099;
const OUTPUT_DIR = process.env.EXPORT_OUTPUT_DIR || path.join(process.env.HOME, 'Desktop/Camify Front-end design/Design pagina\'s/camify-viewer');
const PUBLIC_DIR = path.join(__dirname, 'public');

// All pages to export
const pages = [
  // Core flow
  ['/', 'camify-homepage'],
  ['/cameras', 'camify-category'],
  ['/cameras/mirrorless', 'camify-subcategory'],
  ['/cameras/mirrorless/canon-r', 'camify-sub-subcategory'],
  ['/cameras/out-of-stock', 'camify-category-oos'],

  // Product pages
  ['/product/sony-a7-iv', 'camify-product-overview'],
  ['/product/sony-a7-iv/257962', 'camify-variant-detail'],
  ['/product/sony-a7-v', 'camify-product-oos'],

  // Account & checkout
  ['/login', 'camify-login'],
  ['/account', 'camify-account'],
  ['/checkout', 'camify-checkout'],
  ['/dashboard', 'camify-dashboard'],

  // Lens pages
  ['/lenses', 'camify-lenses'],
  ['/lenses/mirrorless', 'camify-lenses-mirrorless'],
  ['/lenses/mirrorless/canon-rf-fit', 'camify-lenses-canon-rf'],
  ['/lenses/mirrorless/canon-rf-fit/canon-rf-24-70-f28', 'camify-lens-variant'],

  // Browse pages
  ['/brands', 'camify-brands'],
  ['/brands/canon', 'camify-brand-detail'],
  ['/sale', 'camify-sale'],
  ['/new', 'camify-new-arrivals'],
  ['/sell', 'camify-sell'],
  ['/trade-in', 'camify-trade-in'],
  ['/search', 'camify-search'],

  // Info pages
  ['/knowledge-base', 'camify-knowledge-base'],
  ['/faq', 'camify-faq'],
  ['/about', 'camify-about'],
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`));
        else resolve(data);
      });
    }).on('error', reject);
  });
}

// Convert image file to base64 data URI
function imageToDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.avif': 'image/avif' };
  const mime = mimeTypes[ext] || 'application/octet-stream';
  if (ext === '.svg') {
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    return `data:${mime};utf8,${encodeURIComponent(svgContent)}`;
  }
  const base64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${base64}`;
}

// Build image cache from public dir
function buildImageCache() {
  const cache = {};
  function scan(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      const urlPath = prefix + '/' + entry.name;
      if (entry.isDirectory()) {
        scan(fullPath, urlPath);
      } else if (/\.(jpg|jpeg|png|svg|webp|gif|ico|avif)$/i.test(entry.name)) {
        try {
          cache[urlPath] = imageToDataUri(fullPath);
        } catch (e) { /* skip */ }
      }
    }
  }
  scan(PUBLIC_DIR, '');
  return cache;
}

// Replace image src references with data URIs
function inlineImages(html, imageCache) {
  // Replace Next.js Image component URLs: /_next/image?url=%2Fimages%2Ffile.jpg&w=...
  html = html.replace(/src="?\/_next\/image\?url=([^&"]+)[^"]*"?/gi, (match, encodedUrl) => {
    const urlPath = decodeURIComponent(encodedUrl);
    if (imageCache[urlPath]) {
      return `src="${imageCache[urlPath]}"`;
    }
    return match;
  });
  // Replace srcset with Next.js image URLs
  html = html.replace(/srcset="([^"]*)"/gi, (match, srcsetVal) => {
    let changed = false;
    const newSrcset = srcsetVal.replace(/\/_next\/image\?url=([^&]+)[^ ,]*/g, (m, encodedUrl) => {
      const urlPath = decodeURIComponent(encodedUrl);
      if (imageCache[urlPath]) { changed = true; return imageCache[urlPath]; }
      return m;
    });
    return changed ? `srcset="${newSrcset}"` : match;
  });
  // Replace src="/images/..." and src="/icons/..." etc
  html = html.replace(/src="(\/[^"]+\.(jpg|jpeg|png|svg|webp|gif|ico|avif))"/gi, (match, urlPath) => {
    if (imageCache[urlPath]) {
      return `src="${imageCache[urlPath]}"`;
    }
    return match;
  });
  // Also replace url(/images/...) in inline styles
  html = html.replace(/url\((\/[^)]+\.(jpg|jpeg|png|svg|webp|gif|ico|avif))\)/gi, (match, urlPath) => {
    if (imageCache[urlPath]) {
      return `url(${imageCache[urlPath]})`;
    }
    return match;
  });
  return html;
}

// Navigation bar HTML
const navBarHtml = `<div id="export-nav" style="position:sticky;top:0;z-index:9999;background:#1E2133;padding:8px 16px;display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border-bottom:2px solid #E8692A;">
<style>#export-nav::-webkit-scrollbar{display:none}</style>
<a href="index.html" style="flex-shrink:0;color:#E8692A;font-weight:700;font-size:13px;text-decoration:none;margin-right:8px;">Camify</a>
${pages.map(([, name]) => `<a href="${name}.html" style="flex-shrink:0;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none;white-space:nowrap;transition:background .15s,color .15s;" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.color='#fff'" onmouseout="this.style.background='';this.style.color='rgba(255,255,255,.7)'">${name.replace(/^camify-/, '')}</a>`).join('\n')}
<button id="dl-btn" style="flex-shrink:0;margin-left:auto;padding:5px 14px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#E8692A;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;" onmouseover="this.style.background='rgba(232,105,42,.15)';this.style.borderColor='#E8692A'" onmouseout="this.style.background='transparent';this.style.borderColor='rgba(255,255,255,.2)'">&#8595; Download HTML</button>
<script>
document.getElementById('dl-btn').addEventListener('click',function(){
  var nav=document.getElementById('export-nav');
  nav.style.display='none';
  var html='<!DOCTYPE html>\\n'+document.documentElement.outerHTML;
  nav.style.display='';
  var blob=new Blob([html],{type:'text/html'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=location.pathname.split('/').pop()||'page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
});
</script>
</div>`;

// Active page highlight script
function navHighlightScript(currentName) {
  return `<script>document.querySelectorAll('#export-nav a').forEach(a=>{if(a.href.endsWith('${currentName}.html')){a.style.background='rgba(232,105,42,.2)';a.style.color='#E8692A';a.style.fontWeight='600'}});</script>`;
}

async function main() {
  // 1. Build
  console.log('Building...');
  execSync('"' + path.join(__dirname, 'node_modules/.bin/next') + '" build', { cwd: __dirname, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_SKIP_PIN: '1' } });
  console.log('Build done.\n');

  // 2. Read CSS from build output
  const cssDir = path.join(__dirname, '.next/static/chunks');
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  const fullCSS = cssFiles.map(f => fs.readFileSync(path.join(cssDir, f), 'utf-8')).join('\n');
  console.log(`CSS: ${(fullCSS.length / 1024).toFixed(0)}KB from ${cssFiles.length} file(s)`);

  // 3. Build image cache
  const imageCache = buildImageCache();
  console.log(`Images: ${Object.keys(imageCache).length} files cached\n`);

  // 4. Start server (with pin bypass)
  const nextBin = path.join(__dirname, 'node_modules/.bin/next');
  const server = require('child_process').spawn(nextBin, ['start', '-p', String(PORT)], {
    cwd: __dirname,
    stdio: 'pipe',
    env: { ...process.env, NEXT_PUBLIC_SKIP_PIN: '1' },
  });

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Verify server is up
  try {
    const testHtml = await fetch(`http://localhost:${PORT}/faq`);
    if (testHtml.includes('<title>404:')) {
      console.log('WARNING: Server returning 404s, waiting longer...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log('Server ready.\n');
    }
  } catch (e) {
    console.log('WARNING: Server not responding, waiting longer...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // 5. Create output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 6. Export each page
  let success = 0;
  let failed = 0;

  for (const [pagePath, name] of pages) {
    try {
      let html = await fetch(`http://localhost:${PORT}${pagePath}`);

      // Detect soft 404 — only match the actual <title> tag, not RSC payload
      if (html.includes('<title>404: This page could not be found.</title>')) {
        console.log(`  FAIL  ${name} - 404 (page not found)`);
        failed++;
        continue;
      }

      // Remove stylesheet links
      html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, '');

      // Remove Next.js scripts
      html = html.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, '');
      html = html.replace(/<script[^>]*>[^<]*__NEXT[^<]*<\/script>/g, '');

      // Inject CSS inline
      html = html.replace('</head>', `<style>\n${fullCSS}\n</style>\n</head>`);

      // Inline all images
      html = inlineImages(html, imageCache);

      // Inject nav bar after <body...>
      html = html.replace(/(<body[^>]*>)/, `$1\n${navBarHtml}\n${navHighlightScript(name)}`);

      // Inject interactivity script for static HTML
      html = html.replace('</body>', `<script>
/* ===== HEADER HIDE ON SCROLL ===== */
(function(){
  var header=document.querySelector('.header');
  if(!header) return;
  var lastY=0;
  window.addEventListener('scroll',function(){
    var y=window.scrollY;
    if(y>80&&y>lastY){header.classList.add('header--hidden');}
    else{header.classList.remove('header--hidden');}
    lastY=y;
  },{passive:true});
})();

/* ===== PRODUCT CARD HOVER OVERLAY ===== */
(function(){
  // Find all product card image areas (divs with aspect-ratio:1 containing a link overlay)
  document.querySelectorAll('a[href*="/product/"]').forEach(function(link){
    // The hover overlay link has background rgba(0,0,0,0.55) and opacity 0
    if(link.style.opacity!=='0'&&link.style.opacity!=='') return;
    if(!link.style.background||link.style.background.indexOf('rgba(0')===-1) return;
    var container=link.parentElement;
    if(!container) return;
    container.addEventListener('mouseenter',function(){
      link.style.opacity='1';
      link.style.pointerEvents='auto';
    });
    container.addEventListener('mouseleave',function(){
      link.style.opacity='0';
      link.style.pointerEvents='none';
    });
  });
})();

/* ===== WISHLIST HEART TOGGLE ===== */
(function(){
  document.querySelectorAll('button[aria-label="Wishlist"]').forEach(function(btn){
    var wishlisted=false;
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      wishlisted=!wishlisted;
      var svg=btn.querySelector('svg');
      if(!svg) return;
      var path=svg.querySelector('path');
      if(!path) return;
      svg.setAttribute('fill',wishlisted?'#ef4444':'none');
      svg.setAttribute('stroke',wishlisted?'#ef4444':'#888');
      if(path){path.setAttribute('fill',wishlisted?'#ef4444':'none');path.setAttribute('stroke',wishlisted?'#ef4444':'#888');}
    });
  });
})();

/* ===== QUICK VIEW MODAL ===== */
(function(){
  var qvBg=document.querySelector('.qv-modal-bg');
  if(!qvBg) return;
  // Initially hide the modal
  qvBg.style.display='none';
  // Close on background click
  qvBg.addEventListener('click',function(e){
    if(e.target===qvBg) qvBg.style.display='none';
  });
  // Close button
  qvBg.querySelectorAll('button[aria-label="Close"]').forEach(function(btn){
    btn.addEventListener('click',function(){qvBg.style.display='none';});
  });
  // ESC key
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&qvBg.style.display!=='none') qvBg.style.display='none';
  });
  // Image carousel
  var mainImg=qvBg.querySelector('img');
  var thumbBtns=qvBg.querySelectorAll('button[style*="aspect-ratio"]');
  if(thumbBtns.length>0){
    var thumbImgs=[];
    thumbBtns.forEach(function(b){var img=b.querySelector('img');if(img)thumbImgs.push(img.src);});
    var idx=0;
    var counter=qvBg.querySelector('div[style*="rgba(0,0,0,0.55)"]');
    function updateQv(){
      if(mainImg&&thumbImgs[idx]) mainImg.src=thumbImgs[idx];
      if(counter) counter.textContent=(idx+1)+' / '+thumbImgs.length;
      thumbBtns.forEach(function(b,i){
        b.style.border=i===idx?'2px solid #f97316':'2px solid #e5e7eb';
      });
    }
    thumbBtns.forEach(function(b,i){
      b.addEventListener('click',function(e){e.stopPropagation();idx=i;updateQv();});
    });
    qvBg.querySelectorAll('button[aria-label="Previous image"]').forEach(function(b){
      b.addEventListener('click',function(e){e.stopPropagation();idx=(idx-1+thumbImgs.length)%thumbImgs.length;updateQv();});
    });
    qvBg.querySelectorAll('button[aria-label="Next image"]').forEach(function(b){
      b.addEventListener('click',function(e){e.stopPropagation();idx=(idx+1)%thumbImgs.length;updateQv();});
    });
  }
  // Variant selector
  var variantBtns=[];
  qvBg.querySelectorAll('button').forEach(function(b){
    // Variant buttons have conditionLabel text + price
    if(b.querySelector('span[style*="font-weight: 700"][style*="color: rgb(249, 115, 22)"]')||
       b.querySelector('span[style*="font-weight:700"][style*="color:#f97316"]')){
      variantBtns.push(b);
    }
  });
  if(variantBtns.length>1){
    variantBtns.forEach(function(b,i){
      b.addEventListener('click',function(){
        variantBtns.forEach(function(vb,vi){
          vb.style.border=vi===i?'2px solid #f97316':'1px solid #d1d5db';
          vb.style.background=vi===i?'#fff7ed':'#fff';
        });
      });
    });
  }
})();

/* ===== MOBILE MENU ===== */
(function(){
  var hamburger=document.querySelector('.hamburger');
  var mobileMenu=document.querySelector('.mobile-menu');
  if(!hamburger||!mobileMenu) return;
  hamburger.addEventListener('click',function(){
    var open=mobileMenu.classList.contains('is-open');
    if(open){mobileMenu.classList.remove('is-open');hamburger.classList.remove('is-active');}
    else{mobileMenu.classList.add('is-open');hamburger.classList.add('is-active');}
  });
  // Nested expandable items
  mobileMenu.querySelectorAll('.mobile-menu__item').forEach(function(item){
    var trigger=item.querySelector('.mobile-menu__link');
    var sub=item.querySelector('.mobile-menu__sub');
    if(!trigger||!sub) return;
    trigger.addEventListener('click',function(e){
      e.preventDefault();
      item.classList.toggle('is-open');
      sub.style.display=item.classList.contains('is-open')?'block':'none';
    });
  });
})();

/* ===== SEARCH BAR ===== */
(function(){
  var searchDD=document.querySelector('.search-dd');
  var searchInput=document.querySelector('.search-bar input');
  if(!searchDD||!searchInput) return;
  searchInput.addEventListener('focus',function(){searchDD.style.display='block';});
  searchInput.addEventListener('input',function(){searchDD.style.display=this.value?'block':'block';});
  document.addEventListener('mousedown',function(e){
    var wrap=searchInput.closest('.search-bar')||searchInput.parentElement;
    if(wrap&&!wrap.contains(e.target)) searchDD.style.display='none';
  });
})();

/* ===== ACCORDION TOGGLES ===== */
document.querySelectorAll('.accordion__trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=this.closest('.accordion__item');
    if(item){item.classList.toggle('is-open');}
  });
});

/* ===== WHAT'S INCLUDED TOGGLES ===== */
document.querySelectorAll('.whats-included-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var card=this.closest('div');
    if(!card) return;
    var list=card.querySelector('.whats-included-list');
    if(!list) { card=card.parentElement; list=card?card.querySelector('.whats-included-list'):null; }
    if(!list) return;
    var shown=list.style.display!=='none';
    list.style.display=shown?'none':'block';
    var svg=this.querySelector('svg');
    if(svg) svg.style.transform=shown?'rotate(0deg)':'rotate(180deg)';
  });
});

/* ===== IMAGE GALLERY (variant detail page) ===== */
(function(){
  var gallery=document.querySelector('.variant-detail__gallery');
  if(!gallery) return;
  var mainImg=gallery.querySelector('img[alt*="—"]');
  if(!mainImg) return;
  var thumbs=gallery.querySelectorAll('button img');
  var imgs=[];
  thumbs.forEach(function(t){imgs.push(t.src);});
  if(imgs.length<2) return;
  var idx=0;
  var counter=gallery.querySelector('span[style*="rgba(31"]');
  function update(){
    mainImg.src=imgs[idx];
    if(counter) counter.textContent=(idx+1)+' / '+imgs.length;
    thumbs.forEach(function(t,i){
      var btn=t.parentElement;
      btn.style.border=i===idx?'2px solid #f97316':'1px solid #e5e7eb';
      btn.style.opacity=i===idx?'1':'0.6';
    });
  }
  var navBtns=gallery.querySelectorAll('button[aria-label]');
  navBtns.forEach(function(btn){
    if(btn.getAttribute('aria-label')==='Previous image'){
      btn.addEventListener('click',function(e){e.stopPropagation();idx=(idx-1+imgs.length)%imgs.length;update();});
    }
    if(btn.getAttribute('aria-label')==='Next image'){
      btn.addEventListener('click',function(e){e.stopPropagation();idx=(idx+1)%imgs.length;update();});
    }
  });
  thumbs.forEach(function(t,i){
    t.parentElement.addEventListener('click',function(e){e.stopPropagation();idx=i;update();});
  });
})();

/* ===== VIEW ALL VARIANTS TOGGLE ===== */
(function(){
  var panel=document.querySelector('.variants-panel');
  if(!panel) return;
  var btn=panel.previousElementSibling;
  if(!btn || btn.tagName!=='BUTTON') return;
  var chevron=btn.querySelector('.variants-chevron');
  btn.addEventListener('click',function(){
    var shown=panel.style.display!=='none';
    panel.style.display=shown?'none':'';
    if(chevron) chevron.style.transform=shown?'rotate(0deg)':'rotate(180deg)';
  });
})();

/* ===== ADD TO CART (variant detail page) ===== */
(function(){
  var cartBtn=document.querySelector('.variant-detail__add-to-cart');
  var popup=document.querySelector('.cart-popup-overlay');
  if(!cartBtn||!popup) return;
  cartBtn.addEventListener('click',function(){
    cartBtn.style.background='#16a34a';
    cartBtn.innerHTML='<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\"><polyline points=\"20 6 9 17 4 12\"/></svg> Added!';
    setTimeout(function(){popup.style.display='flex';},600);
    setTimeout(function(){cartBtn.style.background='#f97316';cartBtn.innerHTML='<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/></svg> Add to Cart';},2000);
  });
})();

/* ===== ADD TO CART (product overview page) ===== */
(function(){
  var cartBtns=document.querySelectorAll('.product-add-to-cart');
  var popup=document.querySelector('.cart-popup-overlay');
  if(!cartBtns.length||!popup) return;
  cartBtns.forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      popup.style.display='flex';
    });
  });
})();

/* ===== CLOSE CART / UPSELL POPUPS ===== */
(function(){
  var popup=document.querySelector('.cart-popup-overlay');
  if(!popup) return;
  popup.addEventListener('click',function(e){
    if(e.target===popup) popup.style.display='none';
  });
  popup.querySelectorAll('button').forEach(function(b){
    if(b.textContent.trim()==='Continue shopping'){
      b.addEventListener('click',function(){popup.style.display='none';});
    }
  });
  var closeSvgs=popup.querySelectorAll('svg');
  closeSvgs.forEach(function(svg){
    var path=svg.querySelector('path[d="M18 6 6 18M6 6l12 12"]');
    if(path&&svg.closest('button')){
      svg.closest('button').addEventListener('click',function(){popup.style.display='none';});
    }
  });
})();

/* ===== INFO MODALS (condition/shutter) ===== */
(function(){
  var btns=document.querySelectorAll('button[aria-label="Meer informatie"]');
  var condModal=document.querySelector('.info-modal-condition');
  var shutterModal=document.querySelector('.info-modal-shutter');
  if(btns[0]&&condModal){
    btns[0].addEventListener('click',function(){condModal.style.display='flex';});
    condModal.addEventListener('click',function(e){if(e.target===condModal)condModal.style.display='none';});
  }
  if(btns[1]&&shutterModal){
    btns[1].addEventListener('click',function(){shutterModal.style.display='flex';});
    shutterModal.addEventListener('click',function(e){if(e.target===shutterModal)shutterModal.style.display='none';});
  }
  [condModal,shutterModal].forEach(function(m){
    if(!m)return;
    var closeBtn=m.querySelector('button');
    if(closeBtn){closeBtn.addEventListener('click',function(){m.style.display='none';});}
  });
})();

/* ===== DASHBOARD SIDEBAR NAV ===== */
(function(){
  var sidebar=document.querySelector('.dashboard-sidebar');
  if(!sidebar) return;
  var navBtns=sidebar.querySelectorAll('nav button');
  var sections=document.querySelectorAll('[data-section]');
  if(!navBtns.length||!sections.length) return;
  navBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      // Get section key from button text
      var label=btn.querySelector('span');
      if(!label) return;
      var text=label.textContent.trim().toLowerCase();
      // Map label to key
      var keyMap={'overzicht':'overzicht','dashboard':'dashboard','producten':'producten','varianten':'varianten','categories':'categories','orders':'orders','quotes':'quotes','verkoop rapport':'verkoop-rapport','reparaties':'reparaties','kasboek':'kasboek','reserveringen':'reserveringen','klanten':'klanten','incomplete varianten':'incomplete-varianten','accountinstellingen':'accountinstellingen','sandbox':'sandbox'};
      var key=keyMap[text]||text;
      // Show matching section, hide others
      sections.forEach(function(s){
        var sKey=s.getAttribute('data-section');
        s.style.display=(sKey===key||(key==='overzicht'&&sKey==='dashboard'))?'block':'none';
      });
      // Update active state on buttons
      navBtns.forEach(function(b){
        var isActive=b===btn;
        b.style.borderLeft=isActive?'3px solid #E8692A':'3px solid transparent';
        b.style.background=isActive?'#FFF0E8':'transparent';
        b.style.color=isActive?'#E8692A':'#1E2133';
        b.style.fontWeight=isActive?'600':'400';
      });
    });
  });
  // Dashboard mobile toggle
  var mobileToggle=document.querySelector('.dashboard-mobile-toggle button');
  if(mobileToggle&&sidebar){
    mobileToggle.addEventListener('click',function(){
      var left=sidebar.style.left;
      sidebar.style.left=(left==='-280px'||left==='')?'0':'-280px';
    });
  }
  // Dashboard table row clicks (orders, quotes → detail views)
  // The detail views are rendered but hidden. We need to find them and show/hide.
  // Orders and quotes tables have clickable rows with cursor:pointer
  var ordersSection=document.querySelector('[data-section="orders"]');
  if(ordersSection){
    var orderRows=ordersSection.querySelectorAll('tbody tr[style*="cursor"]');
    orderRows.forEach(function(row){
      row.addEventListener('click',function(){
        // The order detail is not in a data-section, it's a sibling div
        // In the rendered HTML, there should be a div that contains the order detail
        // For static export, we can't navigate to detail - just highlight the row
        row.style.background='#FFF0E8';
        setTimeout(function(){row.style.background='';},300);
      });
    });
  }

  // Dashboard search/filter inputs
  document.querySelectorAll('input[placeholder*="Zoek"]').forEach(function(input){
    var table=input.closest('div').parentElement.querySelector('table');
    if(!table) return;
    var rows=table.querySelectorAll('tbody tr');
    input.addEventListener('input',function(){
      var q=input.value.toLowerCase();
      rows.forEach(function(row){
        row.style.display=row.textContent.toLowerCase().indexOf(q)>-1?'':'none';
      });
    });
  });
  // Dashboard select filters
  document.querySelectorAll('select').forEach(function(sel){
    sel.addEventListener('change',function(){
      // Trigger visual feedback
      sel.style.borderColor='#E8692A';
      setTimeout(function(){sel.style.borderColor='#D1D5DB';},300);
    });
  });
})();

/* ===== LANGUAGE / ACCOUNT DROPDOWNS ===== */
(function(){
  document.querySelectorAll('.lang-selector, .header__action-btn[aria-label="Account"]').forEach(function(btn){
    var parent=btn.parentElement;
    if(!parent) return;
    var dd=parent.querySelector('div[style*="position: absolute"]')||parent.querySelector('div[style*="position:absolute"]');
    if(!dd) return;
    dd.style.display='none';
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      dd.style.display=dd.style.display==='none'?'block':'none';
    });
    document.addEventListener('mousedown',function(e){
      if(!parent.contains(e.target)) dd.style.display='none';
    });
  });
})();
</script>\n</body>`);

      const outFile = path.join(OUTPUT_DIR, `${name}.html`);
      fs.writeFileSync(outFile, html);
      console.log(`  OK  ${name}.html (${(html.length / 1024).toFixed(0)}KB)`);
      success++;
    } catch (e) {
      console.log(`  FAIL  ${name} - ${e.message}`);
      failed++;
    }
  }

  // 7. Stop server
  server.kill();

  console.log(`\nExported ${success} pages${failed ? `, ${failed} failed` : ''}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // 8. Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Camify Design Pages</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8F8FA; color: #1E2133; }
  .wrap { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 32px; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; color: #E8692A; margin-bottom: 10px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
  .grid a { display: block; padding: 14px 18px; background: #fff; border: 1.5px solid #EEEEF2; border-radius: 10px; text-decoration: none; color: #1E2133; font-size: 14px; font-weight: 500; transition: border-color .2s, box-shadow .2s; }
  .grid a:hover { border-color: #E8692A; box-shadow: 0 2px 8px rgba(232,105,42,.12); }
  .grid a span { display: block; font-size: 11px; color: #9ca3af; margin-top: 2px; }
</style>
</head>
<body>
${navBarHtml}
<script>document.querySelectorAll('#export-nav a').forEach(a=>{if(a.href.endsWith('index.html')){a.style.color='#fff'}});</script>
<div class="wrap">
  <h1>Camify Design Pages</h1>
  <p class="subtitle">${pages.length} pages &middot; Exported ${new Date().toLocaleDateString('nl-NL')}</p>
${[
  { title: 'Core Flow', items: pages.filter(([p]) => p === '/' || p.startsWith('/cameras')) },
  { title: 'Product Pages', items: pages.filter(([p]) => p.startsWith('/product')) },
  { title: 'Account & Checkout', items: pages.filter(([p]) => ['/login', '/account', '/checkout', '/dashboard'].includes(p)) },
  { title: 'Browse Pages', items: pages.filter(([p]) => ['/brands', '/sale', '/new', '/sell', '/trade-in', '/search'].includes(p) || p.startsWith('/brands/')) },
  { title: 'Info Pages', items: pages.filter(([p]) => ['/knowledge-base', '/faq', '/about'].includes(p)) },
].map(section => `  <div class="section">
    <h2>${section.title}</h2>
    <div class="grid">
${section.items.map(([p, name]) => `      <a href="${name}.html">${name.replace(/^camify-/, '').replace(/-/g, ' ')}<span>${p}</span></a>`).join('\n')}
    </div>
  </div>`).join('\n')}
</div>
</body>
</html>`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
  console.log('  OK  index.html');
}

main().catch(e => {
  console.error('Export failed:', e.message);
  process.exit(1);
});
