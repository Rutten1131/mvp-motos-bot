const fs = require('fs');

const filePath = "d:\\Abel paginas\\mvp motos-motos bot\\mvp motos-motos bot\\app\\crm\\page.tsx";
let text = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// FIX: El crash es por hydration mismatch - new Date() en server vs client da fechas diferentes
// Solución: calcular ultimos7Dias basado en la fecha que ya viene en porDia (del server)
// Si porDia tiene datos, usamos esa fecha como ancla. Si no, usamos el cliente solamente.

const oldBlock = `  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const porDiaMap = new Map(porDia.map((d) => [d.dia, d.n]));
  const totalHoy = activeItem?.n ?? 0;`;

const newBlock = `  // Anclar fechas usando los datos del servidor para evitar hydration mismatch
  const porDiaMap = new Map(porDia.map((d) => [d.dia, d.n]));
  const totalHoy = activeItem?.n ?? 0;
  // Usar la fecha más reciente de porDia como ancla (viene del server, es consistente)
  const fechaAncla = porDia.length > 0
    ? porDia.reduce((a, b) => (a.dia > b.dia ? a : b)).dia
    : null;
  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    if (fechaAncla) {
      // Calcular a partir de la fecha ancla del server
      const [y, m, d] = fechaAncla.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().slice(0, 10);
    }
    // Fallback: si no hay datos aún, mostrar 7 slots vacíos con label genérico
    return \`dia-\${i + 1}\`;
  });`;

if (text.includes(oldBlock)) {
  text = text.replace(oldBlock, newBlock);
  console.log('✅ Fix hydration mismatch: fechas ancla desde server aplicado');
} else {
  console.log('❌ Bloque no encontrado, buscando...');
  const idx = text.indexOf('ultimos7Dias');
  console.log('Contexto:', text.substring(idx-50, idx+300));
}

// También asegurarnos que formatDia maneja "dia-N" correctamente
// Eso ya lo hace con el fallback return str; en la línea 269

const final = text.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, final, 'utf8');

const verify = fs.readFileSync(filePath, 'utf8');
const acentos = (verify.match(/[áéíóúñü]/g) || []).length;
const rotos = (verify.match(/Ã³|Ã©|Ã¡/g) || []).length;
console.log('Acentos OK:', acentos, '| Rotos:', rotos);
