const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'app', 'crm', 'page.tsx');
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  /\$\$\{p\.precio\.toFixed\(2\)\}/g,
  "${precioNum.toFixed(2)}"
);
text = text.replace(
  /\$\$\{precioConIva\}/g,
  "${precioConIva}"
);

fs.writeFileSync(file, text, 'utf8');
console.log('REGEX_REPLACED_SUCCESS');

