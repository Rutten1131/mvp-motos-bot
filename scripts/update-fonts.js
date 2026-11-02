const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

const target = '--font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif;';
const replacement = '--font-family: var(--font-maven), -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif;\n  --font-serif: var(--font-baskerville), "Libre Baskerville", Georgia, serif;';

if (css.includes(target)) {
  css = css.replace(target, replacement);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('FONTS_APPLIED_SUCCESSFULLY');
} else {
  console.log('TARGET_FONT_NOT_FOUND');
}

