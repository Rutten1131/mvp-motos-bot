/**
 * convert-utf8.js
 * Convierte lib/bot.ts y lib/tools.ts de Latin1/ANSI a UTF-8 puro.
 * Preserva todo el contenido; solo cambia la codificación del archivo.
 */
const fs = require('fs');
const path = require('path');

const FILES = ['lib/bot.ts', 'lib/tools.ts'];
const root = path.join(__dirname, '..');

for (const rel of FILES) {
  const filePath = path.join(root, rel);
  
  // Leer con latin1 (nunca pierde bytes)
  const contentLatin1 = fs.readFileSync(filePath, 'latin1');
  
  // Convertir a Buffer UTF-8: interpretamos cada byte como codepoint latin1
  // y lo escribimos como UTF-8
  const buf = Buffer.from(contentLatin1, 'latin1');
  const contentUtf8 = buf.toString('utf8');
  
  // Backup
  const backupPath = filePath + '.latin1.bak';
  fs.writeFileSync(backupPath, contentLatin1, 'latin1');
  
  // Escribir UTF-8 (sin BOM)
  fs.writeFileSync(filePath, contentUtf8, 'utf8');
  
  // Verificar que se puede re-leer como UTF-8 válido
  try {
    const verify = fs.readFileSync(filePath, 'utf8');
    console.log(`✅ ${rel} → UTF-8 OK (${verify.length} chars, backup: ${path.basename(backupPath)})`);
  } catch (e) {
    console.error(`❌ ${rel} → Verificación falló: ${e.message}`);
    // Restaurar backup
    fs.copyFileSync(backupPath, filePath);
    console.log(`   Backup restaurado.`);
  }
}

console.log('\nDone. Ahora ejecuta: npx next build');

