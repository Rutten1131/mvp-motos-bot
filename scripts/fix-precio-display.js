const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'app', 'crm', 'page.tsx');
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  '<div className="showroom-price">\n                    $${p.precio.toFixed(2)}',
  '<div className="showroom-price">\n                    ${precioNum.toFixed(2)}'
);
text = text.replace(
  '<div className="showroom-price-sub">\n                    $${precioConIva}',
  '<div className="showroom-price-sub">\n                    ${precioConIva}'
);

fs.writeFileSync(file, text, 'utf8');
console.log('REPLACED_SUCCESS');

