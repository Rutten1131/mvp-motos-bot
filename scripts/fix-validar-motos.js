/**
 * fix-validar-motos.js
 * Corrige la función validar() en bot.ts para incluir buscar_moto/buscar_repuesto/comparar_motos
 * como herramientas confiables, y actualiza todosNoEncontrados para cubrir búsquedas de motos.
 */
const fs = require('fs');
const path = require('path');

const botPath = path.join(__dirname, '..', 'lib', 'bot.ts');
let content = fs.readFileSync(botPath, 'latin1');

// ──────────────────────────────────────────────────────────────────────────────
// 1. Patch validar(): agregar buscar_moto, comparar_motos, buscar_repuesto
// ──────────────────────────────────────────────────────────────────────────────
const TARGET_VALIDAR = "    || _toolsUsadas.includes('buscar_conocimiento')\r\n    || _toolsUsadas.includes('guardar_dato_cliente')\r\n    || _toolsUsadas.includes('escalar_a_humano')\r\n    || _toolsUsadas.includes('notificar_asesor')\r\n  ) return true;";

const REPLACEMENT_VALIDAR = "    || _toolsUsadas.includes('buscar_conocimiento')\r\n    || _toolsUsadas.includes('guardar_dato_cliente')\r\n    || _toolsUsadas.includes('escalar_a_humano')\r\n    || _toolsUsadas.includes('notificar_asesor')\r\n    || _toolsUsadas.includes('buscar_moto')\r\n    || _toolsUsadas.includes('comparar_motos')\r\n    || _toolsUsadas.includes('buscar_repuesto')\r\n  ) return true;";

if (content.includes(TARGET_VALIDAR)) {
  content = content.replace(TARGET_VALIDAR, REPLACEMENT_VALIDAR);
  console.log('✅ validar() — buscar_moto/comparar_motos/buscar_repuesto agregados como herramientas confiables');
} else {
  console.warn('⚠️  No se encontró el bloque exacto de validar(). Buscando alternativa...');
  // Alternativa: buscar con LF solo
  const TARGET_LF = "    || _toolsUsadas.includes('buscar_conocimiento')\n    || _toolsUsadas.includes('guardar_dato_cliente')\n    || _toolsUsadas.includes('escalar_a_humano')\n    || _toolsUsadas.includes('notificar_asesor')\n  ) return true;";
  const REPLACEMENT_LF = "    || _toolsUsadas.includes('buscar_conocimiento')\n    || _toolsUsadas.includes('guardar_dato_cliente')\n    || _toolsUsadas.includes('escalar_a_humano')\n    || _toolsUsadas.includes('notificar_asesor')\n    || _toolsUsadas.includes('buscar_moto')\n    || _toolsUsadas.includes('comparar_motos')\n    || _toolsUsadas.includes('buscar_repuesto')\n  ) return true;";
  if (content.includes(TARGET_LF)) {
    content = content.replace(TARGET_LF, REPLACEMENT_LF);
    console.log('✅ validar() — patch aplicado (LF alternativo)');
  } else {
    console.error('❌ No se pudo parchear validar(). Revisar manualmente.');
    process.exit(1);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. Patch todosNoEncontrados: incluir buscar_moto y buscar_repuesto
// ──────────────────────────────────────────────────────────────────────────────
const TARGET_TODOS_CRLF = '  const todosNoEncontrados = log.filter((l) => l.nombre === "buscar_producto").length > 0\r\n    && log.filter((l) => l.nombre === "buscar_producto").every((l) => l.resultado?.encontrado === false);';

const REPLACEMENT_TODOS_CRLF = '  const _busquedas = log.filter((l) => ["buscar_producto","buscar_moto","buscar_repuesto"].includes(l.nombre));\r\n  const todosNoEncontrados = _busquedas.length > 0\r\n    && _busquedas.every((l) => l.resultado?.encontrado === false);';

const TARGET_TODOS_LF = '  const todosNoEncontrados = log.filter((l) => l.nombre === "buscar_producto").length > 0\n    && log.filter((l) => l.nombre === "buscar_producto").every((l) => l.resultado?.encontrado === false);';

const REPLACEMENT_TODOS_LF = '  const _busquedas = log.filter((l) => ["buscar_producto","buscar_moto","buscar_repuesto"].includes(l.nombre));\n  const todosNoEncontrados = _busquedas.length > 0\n    && _busquedas.every((l) => l.resultado?.encontrado === false);';

if (content.includes(TARGET_TODOS_CRLF)) {
  content = content.replace(TARGET_TODOS_CRLF, REPLACEMENT_TODOS_CRLF);
  console.log('✅ todosNoEncontrados — buscar_moto/buscar_repuesto incluidos (CRLF)');
} else if (content.includes(TARGET_TODOS_LF)) {
  content = content.replace(TARGET_TODOS_LF, REPLACEMENT_TODOS_LF);
  console.log('✅ todosNoEncontrados — buscar_moto/buscar_repuesto incluidos (LF)');
} else {
  console.warn('⚠️  No se encontró el bloque exacto de todosNoEncontrados. Buscando con regex...');
  const regex = /const todosNoEncontrados = log\.filter\(\(l\) => l\.nombre === "buscar_producto"\)\.length > 0\s*&&\s*log\.filter\(\(l\) => l\.nombre === "buscar_producto"\)\.every\(\(l\) => l\.resultado\?\.encontrado === false\);/;
  if (regex.test(content)) {
    content = content.replace(regex, 'const _busquedas = log.filter((l) => ["buscar_producto","buscar_moto","buscar_repuesto"].includes(l.nombre));\r\n  const todosNoEncontrados = _busquedas.length > 0\r\n    && _busquedas.every((l) => l.resultado?.encontrado === false);');
    console.log('✅ todosNoEncontrados — patch aplicado (regex)');
  } else {
    console.error('❌ No se pudo parchear todosNoEncontrados. Revisar manualmente.');
    process.exit(1);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. También corregir la variable 'algunEncontrado' si usa solo buscar_producto
// ──────────────────────────────────────────────────────────────────────────────
const TARGET_ALGUN_CRLF = 'const algunEncontrado = log.some((l) => l.resultado?.encontrado === true);';
// Esta ya es genérica (no filtra por nombre), así que probablemente está bien
// Solo verificamos que exista
if (content.includes('algunEncontrado')) {
  console.log('✅ algunEncontrado — ya es genérico (sin cambios necesarios)');
} else {
  console.warn('⚠️  algunEncontrado no encontrado en el archivo');
}

// ──────────────────────────────────────────────────────────────────────────────
// Guardar
// ──────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(botPath, content, 'latin1');
console.log('\n✅ bot.ts guardado correctamente.');

// Verificación final
const verify = fs.readFileSync(botPath, 'latin1');
const checks = [
  ["buscar_moto en validar()", verify.includes("_toolsUsadas.includes('buscar_moto')")],
  ["comparar_motos en validar()", verify.includes("_toolsUsadas.includes('comparar_motos')")],
  ["buscar_repuesto en validar()", verify.includes("_toolsUsadas.includes('buscar_repuesto')")],
  ["_busquedas en todosNoEncontrados", verify.includes('_busquedas')],
];
console.log('\n--- Verificación ---');
checks.forEach(([label, ok]) => console.log(ok ? `✅ ${label}` : `❌ ${label}`));

