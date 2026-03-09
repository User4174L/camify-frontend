#!/bin/bash
# Usage: ./export-page.sh [path] [output-name]
# Examples:
#   ./export-page.sh /              homepage
#   ./export-page.sh /brands        brands
#   ./export-page.sh /sale          sale
#   ./export-page.sh /new           new-arrivals
#   ./export-page.sh /dashboard     dashboard

PAGE="${1:-/}"
NAME="${2:-export}"
PORT=3099
OUTPUT="$HOME/Desktop/${NAME}.html"

# Build if needed
echo "Building..."
npx next build 2>&1 | tail -1

# Start server
npx next start -p $PORT &>/dev/null &
SERVER_PID=$!
sleep 3

# Fetch and inline CSS
node -e "
const http = require('http');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const base = 'http://localhost:${PORT}';
  let html = await fetch(base + '${PAGE}');

  const cssRegex = /<link[^>]+rel=\"stylesheet\"[^>]+href=\"([^\"]+)\"/g;
  let inlineCSS = '';
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    const url = match[1].startsWith('http') ? match[1] : base + match[1];
    try { inlineCSS += await fetch(url) + '\n'; } catch(e) {}
  }

  html = html.replace(/<link[^>]+rel=\"stylesheet\"[^>]*>/g, '');
  html = html.replace('</head>', '<style>' + inlineCSS + '</style>\n</head>');

  // Remove Next.js script tags (not needed for static preview)
  html = html.replace(/<script[^>]*src=\"\/_next\/[^\"]*\"[^>]*><\/script>/g, '');

  fs.writeFileSync('${OUTPUT}', html);
  console.log('Exported: ${OUTPUT} (' + (html.length / 1024).toFixed(0) + 'KB)');
}

main().catch(console.error);
"

# Stop server
kill $SERVER_PID 2>/dev/null
