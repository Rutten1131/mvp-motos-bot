/**
 * Parcha bot.ts y tools.ts para Motos & Motos
 * - Reemplaza ESCALAR_RE, FALLBACK, función sistema(), etiquetaIntencion()
 * - Actualiza tipo Empresa y EMP en tools.ts
 * - Agrega tools: buscar_moto, comparar_motos, buscar_repuesto
 * Usa latin1 para leer/escribir los archivos ANSI originales
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

// ─── Parchear bot.ts ────────────────────────────────────────────────────────
let bot = fs.readFileSync(path.join(BASE, 'lib/bot.ts'), 'latin1');

// 1) ESCALAR_RE + FALLBACK
bot = bot.replace(
  /const ESCALAR_RE = \/\\b\(asesor\|humano\|persona real.*?\/i;/,
  `const ESCALAR_RE = /\\b(asesor|humano|persona real|hablar con alguien|agente|queja|reclam|denuncia|estafa|reembols|devoluci|garantia|financiami|credito directo|mecanic urgente|falla grave|accidente)/i;`
);
bot = bot.replace(
  /const FALLBACK = "Prefiero confirmarlo con un asesor para no darte un dato incorrecto\. Ya te paso con uno [^"]*";/,
  `const FALLBACK = "Prefiero confirmarlo con un asesor para no darte un dato incorrecto. Ya te paso con uno \uD83C\uDFCD\uFE0F";`
);

// 2) etiquetaIntencion - reemplazar labels
bot = bot.replace(
  /if \(nombres\.includes\("generar_cotizacion_pdf"\)\) return "Proforma generada";[\s\S]*?if \(!nombres\.length\) return "[^"]*";[\s\S]*?return "Consulta general";/,
  `if (nombres.includes("generar_cotizacion_pdf")) return "Cotizaci\xF3n generada";
  if (nombres.includes("buscar_moto")) return "Consulta de moto";
  if (nombres.includes("comparar_motos")) return "Comparaci\xF3n de modelos";
  if (nombres.includes("buscar_repuesto")) return "Consulta de repuesto";
  if (nombres.includes("buscar_producto")) return "Consulta de accesorio/producto";
  if (nombres.includes("buscar_sucursales")) return "Consulta de sucursal/horario";
  if (nombres.includes("listar_promociones")) return "Consulta de promociones";
  if (nombres.includes("buscar_conocimiento")) return "Consulta institucional/marcas";
  if (nombres.includes("buscar_faq")) return "Pregunta frecuente";
  if (nombres.includes("guardar_dato_cliente")) return "Captura de datos";
  if (nombres.includes("escalar_a_humano") || nombres.includes("notificar_asesor")) return "Pas\xF3 a asesor";
  if (!nombres.length) return "Conversaci\xF3n general";
  return "Consulta general";`
);

// 3) Reemplazar la función sistema() completa
const sistemaViejo = /function sistema\(conv: any\) \{[\s\S]*?^\}/m;
const sistemaNuevo = `function sistema(conv: any) {
  const h = ahora();
  return \`Eres el Asesor IA de Motos & Motos en WhatsApp, el concesionario de confianza en Loja, Ecuador.

\u2550\u2550 IDENTIDAD Y EMPRESA \u2550\u2550
\u2022 NOMBRE: Motos & Motos
\u2022 LEMA: \xABAqu\xED encuentras todas las marcas a los mejores precios\xBB
\u2022 UBICACI\xD3N: Loja, Ecuador (2 sucursales + cobertura en Saraguro)
\u2022 ACTIVIDAD: Venta de motocicletas nuevas, repuestos, accesorios y servicio t\xE9cnico
\u2022 DISTRIBUIDOR AUTORIZADO: Bajaj Ecuador (Loja y Saraguro)
\u2022 OTRAS MARCAS: Daytona, Shineray, KTM, Factory Bike, Dukare, TUKO, Ranger
\u2022 MATRIZ: Av. 8 de Diciembre y Jaramij\xF3 (cerca del Terminal Terrestre Reina del Cisne), Loja
\u2022 SUCURSAL: Av. Manuel Agust\xEDn Aguirre entre 10 de Agosto y J. A. Eguiguren (frente a Bomberos), Loja
\u2022 HORARIO: Lunes\u2013Viernes 08:30\u201319:00 | S\xE1bado 08:30\u201314:00 | Domingo: cerrado
\u2022 WHATSAPP: 095 979 5341
\u2022 REDES: @motosymotosec (Instagram y Facebook)
\u2022 HORA ACTUAL EN LOJA: \${h.dia} \${h.hora}

\u2550\u2550 C\xD3MO AYUDAS AL CLIENTE \u2550\u2550
1. ASESOR DE COMPRA: Recomienda la moto ideal seg\xFAn presupuesto, uso, cilindrada y experiencia del cliente. Usa buscar_moto() para ver disponibilidad real.
2. COMPARADOR DE MODELOS: Muestra diferencias t\xE9cnicas reales entre modelos. Usa comparar_motos() con los IDs que devuelva buscar_moto().
3. BUSCADOR DE REPUESTOS: Busca piezas por marca, modelo y a\xF1o. Usa buscar_repuesto(). JAM\xC1S confirmes compatibilidad sin verificarla en la base de datos.
4. ASESOR DE ACCESORIOS: Cascos, guantes, lubricantes, MUC-OFF, equipamiento. Usa buscar_producto() para accesorios.
5. GENERADOR DE COTIZACIONES: Prepara proformas PDF formales. Usa generar_cotizacion_pdf() con precios reales.
6. ATENCI\xD3N T\xC9CNICA: Recoge datos del cliente y la moto, s\xEDntomas y solicitud. NO diagnostiques fallas graves de forma definitiva: siempre or\xEDenta a revisi\xF3n presencial.
7. CALL CENTER: Transfiere a asesor humano para financiamiento, garant\xEDas, reclamos y negociaciones.

\u2550\u2550 REGLA DE ORO \u2014 USO DE HERRAMIENTAS \u2550\u2550
\u2022 Para motos espec\xEDficas \u2192 llama buscar_moto() de inmediato. NO escribas texto previo ni "un momento".
\u2022 Para repuestos \u2192 llama buscar_repuesto(). Pide siempre marca, modelo y a\xF1o si el cliente no los da.
\u2022 Para comparar \u2192 llama comparar_motos() con los IDs obtenidos de buscar_moto().
\u2022 Para accesorios, lubricantes o limpieza \u2192 llama buscar_producto().
\u2022 Para sucursales/horarios \u2192 llama buscar_sucursales().
\u2022 Para preguntas frecuentes \u2192 llama buscar_faq().
\u2022 Para cotizaci\xF3n \u2192 llama generar_cotizacion_pdf() solo con precios reales del inventario.

\u2550\u2550 REGLAS CR\xCDTICAS ANTI-ALUCINACI\xD3N \u2550\u2550
1. JAM\xC1S inventes precios, stock, cilindrada, potencia ni especificaciones t\xE9cnicas.
2. JAM\xC1S diagnostiques definitivamente una falla mec\xE1nica grave (frenos, direcci\xF3n, motor, neum\xE1ticos).
3. Si el cliente reporta una falla de seguridad \u2192 rec\xF3mienda parar el veh\xEDculo y acudir al taller.
4. Si no hay datos en la BD \u2192 d\xEDlo honestamente y escala al equipo comercial.
5. Para preguntas de stock real en tienda \u2192 no lo garantices; invita a confirmar con asesor.

\u2550\u2550 LO QUE PUEDES RESPONDER DIRECTAMENTE (SIN DB) \u2550\u2550
- \xBFQu\xE9 es Motos & Motos? \u2192 Concesionario multimarca en Loja, distribuidores autorizados Bajaj.
- \xBFD\xF3nde est\xE1n? \u2192 2 sucursales: Matriz (Av. 8 de Diciembre y Jaramij\xF3) y Sucursal (Av. Manuel Agust\xEDn Aguirre).
- \xBFQu\xE9 horario tienen? \u2192 Lunes\u2013Viernes 08:30\u201319:00, S\xE1bados 08:30\u201314:00.
- \xBFTienen repuestos? \u2192 S\xED, repuestos y accesorios para las marcas que distribuimos.
- \xBFTienen servicio t\xE9cnico? \u2192 S\xED, taller de mantenimiento, diagn\xF3stico y reparaci\xF3n.
- \xBFVenden a cr\xE9dito? \u2192 S\xED, hay opciones de financiamiento \u2014 un asesor da los detalles.
- \xBFSon distribuidores Bajaj? \u2192 S\xED, distribuidores autorizados Bajaj Ecuador.
- \xBFTienen motos para ni\xF1os? \u2192 S\xED, consulta disponibilidad con nuestros asesores.

\u2550\u2550 C\xD3MO HABLAS \u2550\u2550
- Tono profesional, entusiasta y cercano. El mundo de las motos es apasionante \u2014 transm\xEDtelo.
- Usa "usted" en el primer contacto. Si el cliente tutea o usa jerga, ad\xE1ptate levemente.
- Emojis con moderaci\xF3n: \uD83C\uDFCD\uFE0F, \u2699\uFE0F, \uD83D\uDD27, \u2705, \uD83D\uDCCB, \uD83D\uDCAA. M\xE1ximo 2 por mensaje.
- REGLA DE SALUDO: Solo saluda en el primer contacto o tras varias horas de inactividad.
- PROHIBIDO: men\xFAs IVR ("marque 1..."). Conversa de forma natural y directa.

\u2550\u2550 COTIZACIONES \u2550\u2550
Cuando el cliente pida una cotizaci\xF3n:
1. Busca cada moto/repuesto/accesorio con la herramienta correspondiente.
2. Presenta un resumen de lo encontrado y lo NO encontrado.
3. Pide nombre completo del cliente.
4. Con el nombre: llama guardar_dato_cliente() y luego generar_cotizacion_pdf() con precios reales.
5. NUNCA cotices precios no verificados en la base de datos.

\u2550\u2550 ESCALADO A ASESOR HUMANO \u2550\u2550
Escala OBLIGATORIAMENTE cuando:
- El cliente lo solicita expl\xEDcitamente.
- Es una consulta de financiamiento o cr\xE9dito (da info general, escala para condiciones exactas).
- Es un reclamo de garant\xEDa o caso legal.
- El cliente reporta una falla mec\xE1nica grave o accidente.
- Ning\xFAn producto fue encontrado en 3 intentos consecutivos.

PROTOCOLO DE ESCALAMIENTO:
1. PRIMERO verifica si ya tienes el nombre del cliente.
   - Si ya tienes nombre: escala directamente con ese nombre.
   - Si no: p\xEDde nombre en UN solo mensaje. En ese turno NO llames escalar_a_humano.
2. Con el nombre confirmado: llama escalar_a_humano() y notificar_asesor().
3. Mensaje de cierre: "Muchas gracias, [Nombre]. Le he transferido con un asesor de Motos & Motos. En breve se pondr\xE1n en contacto por este mismo chat. \uD83C\uDFCD\uFE0F"

\u2550\u2550 ESTADO ACTUAL \u2550\u2550
Estado conversaci\xF3n: \${conv.estado}
Ahora en Loja: \${h.dia} \${h.hora}
Cliente: \${conv.nombre ?? "sin nombre"} | Datos: \${JSON.stringify(conv.datos ?? {})}
Resumen previo: \${conv.resumen ?? "conversaci\xF3n nueva"}\`;
}`;

// Reemplazar función sistema completa
bot = bot.replace(/function sistema\(conv: any\) \{[\s\S]*?\n\}\r?\n/,
  sistemaNuevo + '\n\n'
);

fs.writeFileSync(path.join(BASE, 'lib/bot.ts'), bot, 'latin1');
console.log('✅ lib/bot.ts actualizado');

// ─── Parchear tools.ts ──────────────────────────────────────────────────────
let tools = fs.readFileSync(path.join(BASE, 'lib/tools.ts'), 'latin1');

// 1) Tipo Empresa
tools = tools.replace(
  /export type Empresa = "santiago";/,
  `export type Empresa = "motosymotos";`
);

// 2) EMP enum
tools = tools.replace(
  /const EMP = \{ type: "STRING", enum: \["santiago"\], description: "Empresa\. Omitir si no importa\." \};/,
  `const EMP = { type: "STRING", enum: ["motosymotos"], description: "Empresa. Omitir si no importa." };`
);

// 3) Descripción buscar_producto
tools = tools.replace(
  /"Busca productos en el catálogo de La Reforma por nombre, código o categoría y devuelve precio y disponibilidad\."/,
  `"Busca accesorios, lubricantes, productos de limpieza o mantenimiento (MUC-OFF) en el cat\xE1logo de Motos & Motos. Para motocicletas usa buscar_moto(). Para repuestos usa buscar_repuesto()."`
);

// 4) Descripción buscar_sucursales
tools = tools.replace(
  /"Busca sucursales de La Reforma con dirección, teléfono y horario de atención\. Úsala para CUALQUIER pregunta de ubicación u horario\."/,
  `"Busca sucursales de Motos & Motos con direcci\xF3n, tel\xE9fono y horario de atenci\xF3n. \xDAsala para CUALQUIER pregunta de ubicaci\xF3n u horario."`
);

// 5) Descripción buscar_conocimiento
tools = tools.replace(
  /"Consulta documentos oficiales de La Reforma: información corporativa \(historia desde 1979, RUC, lema 'Su Empresa Amiga'\), líneas de catálogo, sucursales \(Matriz, Zona Militar, Consacola\), políticas de pago, facturación y compras mayoristas\/institucionales\."/,
  `"Consulta documentos oficiales de Motos & Motos: informaci\xF3n corporativa, marcas comercializadas (Bajaj, Daytona, Shineray, KTM, etc.), sucursales, pol\xEDticas de garant\xEDa, financiamiento y servicio t\xE9cnico."`
);

// 6) Descripción buscar_conocimiento temas
tools = tools.replace(
  /description: "Tema a consultar: 'empresa' \(historia, RUC, equipo, departamentos\), 'marcas' \(líneas comerciales y catálogo\), 'sucursales' \(puntos de atención y horarios\), 'politicas_servicios' \(pagos, devoluciones, retenciones, mayorista e institucional\)\."/,
  `description: "Tema: 'empresa' (historia, propietario, trayectoria), 'marcas' (Bajaj, Daytona, Shineray, KTM, Factory, Dukare, TUKO, Ranger), 'sucursales' (puntos de atenci\xF3n y horarios), 'politicas_servicios' (garant\xEDa, financiamiento, servicio t\xE9cnico)."`
);

// 7) Descripción generar_cotizacion_pdf
tools = tools.replace(
  /"Genera una proforma\/cotización formal en PDF con membrete corporativo de La Reforma — Su Empresa Amiga y la envía al WhatsApp del cliente\. Úsala cuando el cliente solicita una cotización, presupuesto o lista de materiales y ya identificaste los productos y cantidades\."/,
  `"Genera una proforma/cotizaci\xF3n formal en PDF con membrete de Motos & Motos y la env\xEDa al WhatsApp del cliente. \xDAsala cuando el cliente solicita cotizaci\xF3n de motos, repuestos o accesorios y ya identificaste los items con precios reales del inventario."`
);

// 8) Descripción buscar_faq
tools = tools.replace(
  /"Busca respuestas a preguntas frecuentes: pagos, factura, domicilio, empleo, devoluciones, contacto\."/,
  `"Busca respuestas a preguntas frecuentes: horarios, ubicaciones, marcas, garant\xEDa, financiamiento, repuestos, servicio t\xE9cnico, accesorios y contacto."`
);

// 9) Descripción guardar_dato_cliente
tools = tools.replace(
  /"Guarda un dato que el cliente dijo con claridad \(nombre, cédula, correo, ciudad\) o la marca con la que habla \(empresa\)\."/,
  `"Guarda un dato que el cliente dijo con claridad: nombre, c\xE9dula, correo, ciudad o marca de moto de inter\xE9s."`
);

// 10) Descripción escalar_a_humano
tools = tools.replace(
  /"Pasa la conversación a un asesor humano\. IMPORTANTE: antes de llamar esta herramienta debes tener el nombre del cliente y el motivo\. Si no los tienes, pregúntalos primero con UN solo mensaje\. Úsala cuando el cliente pide hablar con alguien, para cotizaciones, reclamos, domicilio o casos complejos\."/,
  `"Pasa la conversaci\xF3n a un asesor humano. IMPORTANTE: necesitas el nombre del cliente y el motivo antes de llamarla. \xDAsala cuando el cliente pide asesor, financiamiento, garant\xEDa, falla mec\xE1nica grave o casos complejos."`
);

// 11) Descripción notificar_asesor
tools = tools.replace(
  /"Envía un mensaje de WhatsApp al asesor humano con los datos del cliente que quiere ser atendido\. Llámala justo después de escalar_a_humano, cuando ya tengas nombre del cliente y motivo confirmado\."/,
  `"Env\xEDa un mensaje de WhatsApp al asesor de Motos & Motos con los datos del cliente. Ll\xE1mala justo despu\xE9s de escalar_a_humano."`
);

// 12) Fix empresa en guardar_dato_cliente
tools = tools.replace(
  /const e: Empresa = "santiago";/,
  `const e: Empresa = "motosymotos";`
);

// 13) Agregar nuevas tools ANTES del cierre del array declaraciones
const nuevasTools = `
  {
    name: "buscar_moto",
    description: "Busca motocicletas en el cat\xE1logo de Motos & Motos. Devuelve modelos disponibles con precio, cilindrada y ficha t\xE9cnica. \xDAsala para cualquier consulta sobre motos.",
    parameters: {
      type: "OBJECT",
      properties: {
        texto: { type: "STRING", description: "Marca, modelo, cilindrada o tipo de uso. Ej: 'Bajaj 150', 'doble prop\xF3sito 300cc', 'scooter urbana'" },
        precio_max: { type: "NUMBER", description: "Presupuesto m\xE1ximo del cliente en d\xF3lares" },
        tipo_uso: { type: "STRING", description: "Tipo de uso: urbana, doble_proposito, deportiva, trabajo, infantil, scooter" },
      },
      required: ["texto"],
    },
  },
  {
    name: "comparar_motos",
    description: "Compara 2 o 3 motocicletas lado a lado usando sus IDs del cat\xE1logo. Obtiene los IDs primero con buscar_moto().",
    parameters: {
      type: "OBJECT",
      properties: {
        ids: { type: "ARRAY", items: { type: "NUMBER" }, description: "IDs de las motos a comparar (obtenidos de buscar_moto)" },
      },
      required: ["ids"],
    },
  },
  {
    name: "buscar_repuesto",
    description: "Busca repuestos y piezas compatibles con una moto espec\xEDfica. Siempre pide marca, modelo y a\xF1o al cliente antes de buscar para verificar compatibilidad correcta.",
    parameters: {
      type: "OBJECT",
      properties: {
        marca_moto: { type: "STRING", description: "Marca de la moto. Ej: Bajaj, Daytona, Shineray" },
        modelo_moto: { type: "STRING", description: "Modelo de la moto. Ej: Pulsar 150, TANQ 125, SMX 200" },
        anio: { type: "NUMBER", description: "A\xF1o de la motocicleta" },
        descripcion: { type: "STRING", description: "Descripci\xF3n del repuesto. Ej: pastillas de freno, filtro de aire, kit de cadena" },
        codigo: { type: "STRING", description: "C\xF3digo del repuesto si el cliente lo tiene" },
      },
      required: ["marca_moto", "descripcion"],
    },
  },`;

// Insertar antes del cierre del array "];
tools = tools.replace(/\];\s*\n\n\/\/ Palabras vac\xEDas/, nuevasTools + '\n];\n\n// Palabras vac\xEDas');
// si no matchea con tildes intenta sin tilde
if (!tools.includes(nuevasTools)) {
  tools = tools.replace(/];\n\n\/\/ Palabras vac/, nuevasTools + '\n];\n\n// Palabras vac');
}

// 14) Agregar implementaciones de buscar_moto, comparar_motos, buscar_repuesto ANTES del return final
const implNuevasTools = `
    if (nombre === "buscar_moto") {
      const ws = palabras(String(a?.texto ?? ""));
      const p: any[] = [];
      const conds: string[] = ["p.activo=1", "p.categoria='motocicletas'"];
      if (a?.precio_max) { conds.push("p.precio <= ?"); p.push(Number(a.precio_max)); }
      if (a?.tipo_uso) { conds.push("(f.tipo_uso = ? OR p.subcategoria = ?)"); p.push(a.tipo_uso, a.tipo_uso); }

      let textoCond = "";
      const textParams: any[] = [];
      if (ws.length) {
        textoCond = " AND (" + ws.map(() => "(p.nombre LIKE ? OR p.descripcion LIKE ? OR f.marca LIKE ? OR f.modelo LIKE ?)").join(" OR ") + ")";
        ws.forEach((w) => textParams.push(\`%\${w}%\`, \`%\${w}%\`, \`%\${w}%\`, \`%\${w}%\`));
      }

      const rows = await q<any>(
        \`SELECT p.id AS producto_id, p.nombre, p.descripcion, p.precio, p.stock,
                f.marca, f.modelo, f.cilindrada, f.potencia, f.tipo_motor,
                f.transmision, f.frenos_delantero, f.frenos_trasero,
                f.capacidad_combustible, f.consumo_km_litro, f.peso_kg,
                f.garantia, f.tipo_uso, f.anio,
                c.url_imagen AS imagen
         FROM bot_productos p
         LEFT JOIN bot_fichas_tecnicas f ON f.producto_id = p.id
         LEFT JOIN bot_categorias_img c ON c.categoria = p.categoria
         WHERE \${conds.join(" AND ")}\${textoCond}
         ORDER BY p.stock DESC, p.precio ASC
         LIMIT 6\`,
        [...p, ...textParams]
      );
      return rows.length
        ? { encontrado: true, motos: rows }
        : { encontrado: false, mensaje: "No se encontraron motos con esos criterios. Puede consultar disponibilidad con un asesor." };
    }

    if (nombre === "comparar_motos") {
      const ids: number[] = (a?.ids ?? []).map(Number).filter(Boolean).slice(0, 3);
      if (!ids.length) return { error: "Se necesitan IDs de motos para comparar. Usa buscar_moto() primero." };
      const placeholders = ids.map(() => "?").join(",");
      const rows = await q<any>(
        \`SELECT p.id, p.nombre, p.precio,
                f.marca, f.modelo, f.cilindrada, f.potencia, f.tipo_motor,
                f.transmision, f.frenos_delantero, f.frenos_trasero,
                f.capacidad_combustible, f.consumo_km_litro, f.peso_kg,
                f.garantia, f.tipo_uso
         FROM bot_productos p
         LEFT JOIN bot_fichas_tecnicas f ON f.producto_id = p.id
         WHERE p.id IN (\${placeholders}) AND p.activo=1\`,
        ids
      );
      return rows.length ? { encontrado: true, comparacion: rows } : { encontrado: false };
    }

    if (nombre === "buscar_repuesto") {
      const marca = String(a?.marca_moto ?? "").trim();
      const modelo = String(a?.modelo_moto ?? "").trim();
      const desc = String(a?.descripcion ?? "").trim();
      const codigo = String(a?.codigo ?? "").trim();
      const anio = Number(a?.anio ?? 0);

      const ws = palabras(desc + " " + codigo);
      const p: any[] = [];
      const conds: string[] = ["pr.activo=1", "pr.categoria='repuestos'"];

      // Filtro de texto en nombre del repuesto
      if (ws.length) {
        const tc = ws.map(() => "(pr.nombre LIKE ? OR pr.descripcion LIKE ?)").join(" OR ");
        conds.push(\`(\${tc})\`);
        ws.forEach((w) => p.push(\`%\${w}%\`, \`%\${w}%\`));
      }
      if (codigo) { conds.push("pr.codigo = ?"); p.push(codigo); }

      // Buscar con compatibilidad si hay marca
      let rows: any[] = [];
      if (marca) {
        const compatConds = [...conds, "cr.marca_moto LIKE ?"];
        const compatParams = [...p, \`%\${marca}%\`];
        if (modelo) { compatConds.push("cr.modelo_moto LIKE ?"); compatParams.push(\`%\${modelo}%\`); }
        if (anio) { compatConds.push("(cr.anio_desde IS NULL OR cr.anio_desde <= ?) AND (cr.anio_hasta IS NULL OR cr.anio_hasta >= ?)"); compatParams.push(anio, anio); }
        rows = await q<any>(
          \`SELECT pr.id, pr.codigo, pr.nombre, pr.descripcion, pr.precio, pr.stock,
                  cr.marca_moto, cr.modelo_moto, cr.anio_desde, cr.anio_hasta
           FROM bot_productos pr
           JOIN bot_compatibilidad_repuestos cr ON cr.repuesto_id = pr.id
           WHERE \${compatConds.join(" AND ")}
           LIMIT 5\`,
          compatParams
        );
      }

      // Si no hay resultado con compatibilidad, buscar solo por descripción
      if (!rows.length && ws.length) {
        rows = await q<any>(
          \`SELECT pr.id, pr.codigo, pr.nombre, pr.descripcion, pr.precio, pr.stock,
                  NULL AS marca_moto, NULL AS modelo_moto, NULL AS anio_desde, NULL AS anio_hasta
           FROM bot_productos pr
           WHERE \${conds.join(" AND ")}
           LIMIT 5\`,
          p
        );
      }

      if (!rows.length) {
        return {
          encontrado: false,
          mensaje: \`No encontramos el repuesto en nuestro cat\xE1logo digital. Le recomendamos contactar directamente a nuestros asesores al 095 979 5341 indicando la marca (\${marca}), modelo (\${modelo || "?"}) y a\xF1o de su moto para verificar disponibilidad.\`
        };
      }

      const sinCompatibilidad = rows.some((r: any) => !r.marca_moto);
      return {
        encontrado: true,
        repuestos: rows,
        advertencia: sinCompatibilidad
          ? "IMPORTANTE: No se pudo verificar compatibilidad exacta con tu moto. Confirma con un asesor antes de comprar."
          : null
      };
    }
`;

tools = tools.replace(
  /    return \{ error: "herramienta desconocida" \};/,
  implNuevasTools + '\n    return { error: "herramienta desconocida" };'
);

fs.writeFileSync(path.join(BASE, 'lib/tools.ts'), tools, 'latin1');
console.log('✅ lib/tools.ts actualizado');

// ─── Verificación rápida ─────────────────────────────────────────────────────
const botFinal = fs.readFileSync(path.join(BASE, 'lib/bot.ts'), 'latin1');
const toolsFinal = fs.readFileSync(path.join(BASE, 'lib/tools.ts'), 'latin1');

console.log('\n📋 Verificación:');
console.log(' bot.ts - "Motos & Motos":', botFinal.includes('Motos & Motos') ? '✅' : '❌');
console.log(' bot.ts - buscar_moto:', botFinal.includes('buscar_moto') ? '✅' : '❌');
console.log(' tools.ts - motosymotos:', toolsFinal.includes('motosymotos') ? '✅' : '❌');
console.log(' tools.ts - buscar_moto:', toolsFinal.includes('buscar_moto') ? '✅' : '❌');
console.log(' tools.ts - comparar_motos:', toolsFinal.includes('comparar_motos') ? '✅' : '❌');
console.log(' tools.ts - buscar_repuesto:', toolsFinal.includes('buscar_repuesto') ? '✅' : '❌');
console.log('\n🏍️ Parche completo!');

