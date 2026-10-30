import { q, exec } from "./db";
import { generar, textoDe, type Content } from "./gemini";
import { declaraciones, ejecutar, type Ctx } from "./tools";
import { ahora, asesoresDisponibles } from "./time";
import { enviarTexto, enviarImagen } from "./evolution";

const ESCALAR_RE = /\b(asesor|humano|persona real|hablar con alguien|agente|queja|reclam|denuncia|estafa|reembols|devoluci|garantia|financiami|credito directo|mecanic urgente|falla grave|accidente)/i;
const FALLBACK = "Prefiero confirmarlo con un asesor para no darte un dato incorrecto. Ya te paso con uno <�";

// Palabras clave que indican que el usuario pide ver una foto/imagen
const PIDE_FOTO_RE = /\b(foto|fotos|imagen|imag[ée]n|picture|pic|ver|mu[eé]str|mostrar|manda|env[ií]a|ense[ñn]|miro|catalogo visual|cat[aá]logo visual)\b/i;

// Convierte los nombres de tools en una etiqueta legible de intención
function etiquetaIntencion(log: { nombre: string }[], escalado: boolean, bloqueada: boolean): string {
  if (escalado) return "Pasó a administración";
  if (bloqueada) return "Respuesta bloqueada";
  const nombres = [...new Set(log.map((l) => l.nombre))];
  if (nombres.includes("generar_cotizacion_pdf")) return "Cotizaci�n generada";
  if (nombres.includes("buscar_moto")) return "Consulta de moto";
  if (nombres.includes("comparar_motos")) return "Comparaci�n de modelos";
  if (nombres.includes("buscar_repuesto")) return "Consulta de repuesto";
  if (nombres.includes("buscar_producto")) return "Consulta de accesorio/producto";
  if (nombres.includes("buscar_sucursales")) return "Consulta de sucursal/horario";
  if (nombres.includes("listar_promociones")) return "Consulta de promociones";
  if (nombres.includes("buscar_conocimiento")) return "Consulta institucional/marcas";
  if (nombres.includes("buscar_faq")) return "Pregunta frecuente";
  if (nombres.includes("guardar_dato_cliente")) return "Captura de datos";
  if (nombres.includes("escalar_a_humano") || nombres.includes("notificar_asesor")) return "Pas� a asesor";
  if (!nombres.length) return "Conversaci�n general";
  return "Consulta general";
}

function sistema(conv: any) {
  const h = ahora();
  return `Eres el Asesor IA de Motos & Motos en WhatsApp, el concesionario de confianza en Loja, Ecuador.

PP IDENTIDAD Y EMPRESA PP
" NOMBRE: Motos & Motos
" LEMA: �Aqu� encuentras todas las marcas a los mejores precios�
" UBICACI�N: Loja, Ecuador (2 sucursales + cobertura en Saraguro)
" ACTIVIDAD: Venta de motocicletas nuevas, repuestos, accesorios y servicio t�cnico
" DISTRIBUIDOR AUTORIZADO: Bajaj Ecuador (Loja y Saraguro)
" OTRAS MARCAS: Daytona, Shineray, KTM, Factory Bike, Dukare, TUKO, Ranger
" MATRIZ: Av. 8 de Diciembre y Jaramij� (cerca del Terminal Terrestre Reina del Cisne), Loja
" SUCURSAL: Av. Manuel Agust�n Aguirre entre 10 de Agosto y J. A. Eguiguren (frente a Bomberos), Loja
" HORARIO: LunesViernes 08:3019:00 | S�bado 08:3014:00 | Domingo: cerrado
" WHATSAPP: 095 979 5341
" REDES: @motosymotosec (Instagram y Facebook)
" HORA ACTUAL EN LOJA: ${h.dia} ${h.hora}

PP C�MO AYUDAS AL CLIENTE PP
1. ASESOR DE COMPRA: Recomienda la moto ideal seg�n presupuesto, uso, cilindrada y experiencia del cliente. Usa buscar_moto() para ver disponibilidad real.
2. COMPARADOR DE MODELOS: Muestra diferencias t�cnicas reales entre modelos. Usa comparar_motos() con los IDs que devuelva buscar_moto().
3. BUSCADOR DE REPUESTOS: Busca piezas por marca, modelo y a�o. Usa buscar_repuesto(). JAM�S confirmes compatibilidad sin verificarla en la base de datos.
4. ASESOR DE ACCESORIOS: Cascos, guantes, lubricantes, MUC-OFF, equipamiento. Usa buscar_producto() para accesorios.
5. GENERADOR DE COTIZACIONES: Prepara proformas PDF formales. Usa generar_cotizacion_pdf() con precios reales.
6. ATENCI�N T�CNICA: Recoge datos del cliente y la moto, s�ntomas y solicitud. NO diagnostiques fallas graves de forma definitiva: siempre or�enta a revisi�n presencial.
7. CALL CENTER: Transfiere a asesor humano para financiamiento, garant�as, reclamos y negociaciones.

PP REGLA DE ORO  USO DE HERRAMIENTAS PP
" Para motos espec�ficas � llama buscar_moto() de inmediato. NO escribas texto previo ni "un momento".
" Para repuestos � llama buscar_repuesto(). Pide siempre marca, modelo y a�o si el cliente no los da.
" Para comparar � llama comparar_motos() con los IDs obtenidos de buscar_moto().
" Para accesorios, lubricantes o limpieza � llama buscar_producto().
" Para sucursales/horarios � llama buscar_sucursales().
" Para preguntas frecuentes � llama buscar_faq().
" Para cotizaci�n � llama generar_cotizacion_pdf() solo con precios reales del inventario.

PP REGLAS CR�TICAS ANTI-ALUCINACI�N PP
1. JAM�S inventes precios, stock, cilindrada, potencia ni especificaciones t�cnicas.
2. JAM�S diagnostiques definitivamente una falla mec�nica grave (frenos, direcci�n, motor, neum�ticos).
3. Si el cliente reporta una falla de seguridad � rec�mienda parar el veh�culo y acudir al taller.
4. Si no hay datos en la BD � d�lo honestamente y escala al equipo comercial.
5. Para preguntas de stock real en tienda � no lo garantices; invita a confirmar con asesor.

PP LO QUE PUEDES RESPONDER DIRECTAMENTE (SIN DB) PP
- �Qu� es Motos & Motos? � Concesionario multimarca en Loja, distribuidores autorizados Bajaj.
- �D�nde est�n? � 2 sucursales: Matriz (Av. 8 de Diciembre y Jaramij�) y Sucursal (Av. Manuel Agust�n Aguirre).
- �Qu� horario tienen? � LunesViernes 08:3019:00, S�bados 08:3014:00.
- �Tienen repuestos? � S�, repuestos y accesorios para las marcas que distribuimos.
- �Tienen servicio t�cnico? � S�, taller de mantenimiento, diagn�stico y reparaci�n.
- �Venden a cr�dito? � S�, hay opciones de financiamiento  un asesor da los detalles.
- �Son distribuidores Bajaj? � S�, distribuidores autorizados Bajaj Ecuador.
- �Tienen motos para ni�os? � S�, consulta disponibilidad con nuestros asesores.

PP C�MO HABLAS PP
- Tono profesional, entusiasta y cercano. El mundo de las motos es apasionante  transm�telo.
- Usa "usted" en el primer contacto. Si el cliente tutea o usa jerga, ad�ptate levemente.
- Emojis con moderaci�n: <�, �, =', , =�, =�. M�ximo 2 por mensaje.
- REGLA DE SALUDO: Solo saluda en el primer contacto o tras varias horas de inactividad.
- PROHIBIDO: men�s IVR ("marque 1..."). Conversa de forma natural y directa.

PP COTIZACIONES PP
Cuando el cliente pida una cotizaci�n:
1. Busca cada moto/repuesto/accesorio con la herramienta correspondiente.
2. Presenta un resumen de lo encontrado y lo NO encontrado.
3. Pide nombre completo del cliente.
4. Con el nombre: llama guardar_dato_cliente() y luego generar_cotizacion_pdf() con precios reales.
5. NUNCA cotices precios no verificados en la base de datos.

PP ESCALADO A ASESOR HUMANO PP
Escala OBLIGATORIAMENTE cuando:
- El cliente lo solicita expl�citamente.
- Es una consulta de financiamiento o cr�dito (da info general, escala para condiciones exactas).
- Es un reclamo de garant�a o caso legal.
- El cliente reporta una falla mec�nica grave o accidente.
- Ning�n producto fue encontrado en 3 intentos consecutivos.

PROTOCOLO DE ESCALAMIENTO:
1. PRIMERO verifica si ya tienes el nombre del cliente.
   - Si ya tienes nombre: escala directamente con ese nombre.
   - Si no: p�de nombre en UN solo mensaje. En ese turno NO llames escalar_a_humano.
2. Con el nombre confirmado: llama escalar_a_humano() y notificar_asesor().
3. Mensaje de cierre: "Muchas gracias, [Nombre]. Le he transferido con un asesor de Motos & Motos. En breve se pondr�n en contacto por este mismo chat. <�"

PP ESTADO ACTUAL PP
Estado conversaci�n: ${conv.estado}
Ahora en Loja: ${h.dia} ${h.hora}
Cliente: ${conv.nombre ?? "sin nombre"} | Datos: ${JSON.stringify(conv.datos ?? {})}
Resumen previo: ${conv.resumen ?? "conversaci�n nueva"}`;
}


// Valida que precios en $ mencionados por el bot vengan de una herramienta.
function validar(texto: string, resultados: string, _toolsUsadas: string[]): boolean {
  // Sin herramientas: el modelo responde desde el historial — confiar siempre
  if (_toolsUsadas.length === 0) return true;
  // Herramientas que generan respuestas confiables por naturaleza
  if (_toolsUsadas.length > 5
    || _toolsUsadas.includes('generar_cotizacion_pdf')
    || _toolsUsadas.includes('listar_promociones')
    || _toolsUsadas.includes('buscar_sucursales')
    || _toolsUsadas.includes('buscar_faq')
    || _toolsUsadas.includes('buscar_conocimiento')
    || _toolsUsadas.includes('guardar_dato_cliente')
    || _toolsUsadas.includes('escalar_a_humano')
    || _toolsUsadas.includes('notificar_asesor')
    || _toolsUsadas.includes('buscar_moto')
    || _toolsUsadas.includes('comparar_motos')
    || _toolsUsadas.includes('buscar_repuesto')
  ) return true;
  // Si buscar_producto encontró productos reales — confiar en el modelo
  try {
    const parsed = JSON.parse(resultados) as any[];
    const hayProductos = parsed.some((r) => r?.encontrado === true && (r?.productos?.length ?? 0) > 0);
    if (hayProductos) return true;
  } catch { /* ignora y continúa */ }
  // Solo validar números si NO se encontraron productos (caso en que el modelo podría inventar)
  const nums = new Set((resultados.match(/\d+(?:\.\d+)?/g) ?? []).map(Number));
  nums.add(5);
  const montos = texto.match(/\$\s?\d+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?\s?(?:d[oó]lares|USD)/gi) ?? [];
  for (const m of montos) {
    const n = parseFloat((m.match(/\d+(?:[.,]\d{1,2})?/)![0]).replace(',', '.'));
    const ok = [...nums].some((x) =>
      Math.abs(x - n) < 0.02 ||
      Math.abs(x * 1.15 - n) < 0.05 ||
      Math.abs(x - n * 1.15) < 0.05
    );
    if (!ok) return false;
  }
  return true;
}

function limpiarSaludoRepetido(texto: string): string {
  // Elimina saludos al inicio como "¡Hola de nuevo!", "¡Hola!", "Hola Cristhopher,", "Buenas tardes,", etc.
  return texto
    .replace(/^(\s*¡?\s*(hola(?:\s+de\s+nuevo)?|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches)(?:\s+[a-záéíóúñ]+)?\s*[!.,:;]*\s*(?:[😊👋🤖✨🛒🍎]\s*)*)+/i, "")
    .trim();
}

async function responder(conv: any, texto: string, ids: number[]) {
  // Verificamos cuándo fue el último mensaje del bot
  const [ultimoBot] = await q<any>(
    "SELECT creado_en FROM bot_mensajes WHERE conversacion_id=? AND rol='bot' ORDER BY id DESC LIMIT 1",
    [conv.id]
  );

  let textoFinal = texto;

  if (ultimoBot?.creado_en) {
    const diffHoras = (Date.now() - new Date(ultimoBot.creado_en).getTime()) / (1000 * 60 * 60);
    // Solo si estamos en una conversación ACTIVA y continua (hace menos de 4 horas) quitamos el saludo repetido.
    // Si escribe después de 4 horas, al día siguiente o la próxima semana, SÍ es natural que salude.
    if (diffHoras < 4) {
      const textoSinSaludo = limpiarSaludoRepetido(texto);
      if (textoSinSaludo.length > 5) {
        textoFinal = textoSinSaludo.charAt(0).toUpperCase() + textoSinSaludo.slice(1);
      }
    }
  }

  await enviarTexto(conv.jid, textoFinal);
  await exec("INSERT INTO bot_mensajes (conversacion_id, rol, texto) VALUES (?, 'bot', ?)", [conv.id, textoFinal]);
  if (ids.length) {
    const maxId = Math.max(...ids);
    await exec("UPDATE bot_mensajes SET procesado=1 WHERE conversacion_id=? AND rol='cliente' AND id <= ?", [conv.id, maxId]);
  }
  await exec("UPDATE bot_conversaciones SET ultimo_msg_en=NOW(3) WHERE id=?", [conv.id]);
}

async function historial(convId: number, n: number) {
  return (await q<any>("SELECT id, rol, texto FROM bot_mensajes WHERE conversacion_id=? ORDER BY id DESC LIMIT ?", [convId, n])).reverse();
}

async function escalar(conv: any, motivo: string) {
  // Generamos el resumen a partir del historial en memoria (sin llamada extra a Gemini)
  // para no superar el límite de 60 s de Vercel Serverless.
  const h = await historial(conv.id, 20);
  const resumen = h.map((m: any) => `${m.rol === 'cliente' ? '👤 Cliente' : '🤖 Bot'}: ${m.texto}`).join("\n").slice(0, 2000);
  await exec("UPDATE bot_conversaciones SET bot_activo=0, estado='ESCALADO', motivo_escalamiento=?, resumen_agente=? WHERE id=?", [motivo, resumen, conv.id]);
  await exec("INSERT INTO bot_eventos (conversacion_id, tipo, detalle) VALUES (?, 'escalado', ?)", [conv.id, JSON.stringify({ motivo })]);
  return asesoresDisponibles();
}

export async function procesarConversacion(convId: number) {
  const [conv] = await q<any>(
    `SELECT c.*, ct.nombre, ct.telefono AS jid, ct.datos FROM bot_conversaciones c JOIN bot_contactos ct ON ct.id=c.contacto_id WHERE c.id=?`, [convId]);
  if (!conv || !conv.bot_activo) return { omitido: "bot inactivo" };
  const pend = await q<any>("SELECT id, texto FROM bot_mensajes WHERE conversacion_id=? AND rol='cliente' AND procesado=0 ORDER BY id", [convId]);
  if (!pend.length) return { omitido: "sin pendientes" };
  const ids: number[] = pend.map((p) => p.id);
  const t0 = Date.now();

  // 0) Comando temporal de prueba: /reset para reiniciar de 0 el número
  const textoEntrante = pend.map((p) => p.texto || "").join(" ").trim();
  if (/^\/reset\b/i.test(textoEntrante)) {
    // Borrar trazas, eventos, mensajes y la conversación
    await exec("DELETE FROM bot_eventos WHERE conversacion_id=?", [convId]);
    await exec("DELETE FROM bot_trazas WHERE conversacion_id=?", [convId]);
    await exec("DELETE FROM bot_mensajes WHERE conversacion_id=?", [convId]);
    await exec("DELETE FROM bot_conversaciones WHERE id=?", [convId]);
    // Borrar el contacto si no tiene más conversaciones
    if (conv.contacto_id) {
      await exec("DELETE FROM bot_contactos WHERE id=?", [conv.contacto_id]);
    }
    // Enviar confirmación al WhatsApp
    await enviarTexto(conv.jid, "🔄 *¡Datos reseteados con éxito!* Se eliminó el historial y tus datos para este número. Puedes iniciar una nueva conversación de prueba desde cero. 🙌");
    return { ok: true, reset: true };
  }

  // 1) Disparadores por CODIGO (solo si es queja grave o fraude explícito con insulto/denuncia extrema)
  const esQuejaExtrema = /\b(denuncia|estafa|demanda judicial|fiscalia)\b/i.test(textoEntrante);
  if (esQuejaExtrema) {
    const a = await escalar(conv, "Caso legal / denuncia urgente");
    await responder(conv, a.disponible
      ? "Hasta aquí llega mi intervención como asistente virtual. He pasado tu caso de inmediato a un asesor humano de nuestra administración. En un momento se pondrá en contacto contigo directamente 🙌"
      : `Hasta aquí llega mi intervención como asistente virtual. Dejo tu caso registrado con carácter prioritario para administración. Nuestro horario de atención es ${a.texto}; apenas inicien labores se pondrán en contacto contigo directamente por aquí 🙌`, ids);
    return { escalado: true };
  }

  // 2) Contexto: datos + estado + resumen (system) y ultimos 14 mensajes (contents)
  const contents: Content[] = [];
  for (const m of await historial(convId, 14)) {
    const role = m.rol === "cliente" ? "user" : "model";
    const last = contents[contents.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n" + m.texto;
    else contents.push({ role, parts: [{ text: m.texto }] });
  }
  while (contents[0]?.role === "model") contents.shift();

  const ctx: Ctx = { convId, contactoId: conv.contacto_id, empresa: conv.empresa };
  const system = sistema(conv);
  const log: { nombre: string; args: any; resultado: any }[] = [];
  let tokens = 0, texto = "";

  // 3) Loop de herramientas (máximo 6 vueltas — necesario para listas con varios productos)
  for (let i = 0; i < 6; i++) {
    const res = await generar({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      tools: [{ functionDeclarations: declaraciones }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    });
    tokens += res?.usageMetadata?.totalTokenCount ?? 0;
    const cand = res?.candidates?.[0];
    const calls = (cand?.content?.parts ?? []).filter((p: any) => p.functionCall);
    if (!calls.length) { texto = textoDe(res); break; }
    contents.push(cand.content); // se conserva tal cual (incluye firmas de pensamiento)
    const respuestas: any[] = [];
    for (const c of calls) {
      const resultado = await ejecutar(c.functionCall.name, c.functionCall.args ?? {}, ctx);
      log.push({ nombre: c.functionCall.name, args: c.functionCall.args ?? {}, resultado });
      respuestas.push({ functionResponse: { name: c.functionCall.name, response: { result: resultado } } });
    }
    contents.push({ role: "user", parts: respuestas });
  }

  // 4) Validacion anti-alucinacion
  const resultados = JSON.stringify(log.map((l) => l.resultado));
  const toolsUsadas = log.map((l) => l.nombre);
  let bloqueada = false;
  if (!texto) { bloqueada = true; texto = FALLBACK; }
  else if (!validar(texto, resultados, toolsUsadas)) { bloqueada = true; texto = FALLBACK; }

  // 5) Escalado / intentos fallidos
  let motivo = ctx.escalar ?? (bloqueada ? "El bot no pudo dar una respuesta verificable" : null);
  // Solo cuenta fallo si NO se encontró NINGÚN producto en toda la conversación
  // (si algunos items no están en catálogo pero otros sí, no es un fallo)
  const algunEncontrado = log.some((l) => l.resultado?.encontrado === true);
  const _busquedas = log.filter((l) => ["buscar_producto","buscar_moto","buscar_repuesto"].includes(l.nombre));
  const todosNoEncontrados = _busquedas.length > 0
    && _busquedas.every((l) => l.resultado?.encontrado === false);
  let intentos = todosNoEncontrados && !algunEncontrado ? conv.intentos_fallidos + 1 : 0;
  if (!motivo && intentos >= 3) motivo = "El bot no encontró ningún producto en 3 intentos consecutivos";
  if (motivo) { await escalar(conv, motivo); intentos = 0; }

  await responder(conv, texto, ids);
  await exec("UPDATE bot_conversaciones SET intentos_fallidos=?, estado=IF(?, estado, 'ATENDIENDO') WHERE id=?", [intentos, motivo ? 1 : 0, convId]);

  // Enviar imagen SOLO si el usuario pidió explícitamente ver fotos/imágenes
  // Analiza todos los mensajes pendientes del cliente para detectar la intención visual
  const usuarioPidioFoto = PIDE_FOTO_RE.test(textoEntrante);
  if (!bloqueada && !motivo && usuarioPidioFoto) {
    try {
      const prodLogs = log.filter((l) => l.nombre === "buscar_producto" && l.resultado?.encontrado);
      const todasLasImgs = prodLogs
        .flatMap((l) => l.resultado?.productos || [])
        .map((p: any) => p.imagen_categoria)
        .filter(Boolean);
      // Deduplicar por URL — la primera es la de mayor score (ya ordenada por tools.ts)
      const imagenesUnicas: string[] = [];
      for (const img of todasLasImgs) {
        if (!imagenesUnicas.includes(img)) imagenesUnicas.push(img);
        if (imagenesUnicas.length >= 2) break; // Máximo 2 cuando el usuario pide fotos
      }
      for (const imgUrl of imagenesUnicas) {
        await enviarImagen(conv.jid, imgUrl);
        // Registrar la imagen enviada en el chat del CRM
        await exec(
          "INSERT INTO bot_mensajes (conversacion_id, rol, texto) VALUES (?, 'bot', ?)",
          [conv.id, `📷 [IMAGEN: ${imgUrl}]`]
        );
        if (imagenesUnicas.length > 1) await new Promise(r => setTimeout(r, 600));
      }
      if (prodLogs.length > 0 && imagenesUnicas.length === 0) {
        // Hay productos pero sin imagen en BD — avisar amablemente
        await enviarTexto(conv.jid, "📷 Aún no contamos con imagen disponible para este producto en nuestro catálogo digital. Puede visitarnos en tienda para verlo personalmente.");
      }
    } catch (e: any) {
      console.warn("[Bot Imagen] No se pudo enviar imagen:", e?.message || e);
    }
  }

  // Guardar intención detectada
  // REGLA: "Proforma generada" es permanente — una vez que se generó una proforma,
  // ese es el evento más importante de la conversación y no debe sobreescribirse.
  const intencion = etiquetaIntencion(log, !!motivo, bloqueada);
  if (conv.intencion !== 'Proforma generada') {
    await exec("UPDATE bot_conversaciones SET intencion=? WHERE id=?", [intencion, convId]);
  }

  await exec("INSERT INTO bot_trazas (conversacion_id, prompt, respuesta, tools_llamadas, bloqueada, tokens, latencia_ms) VALUES (?,?,?,?,?,?,?)", [
    convId, JSON.stringify({ system, contents }), JSON.stringify({ texto }), JSON.stringify(log), bloqueada ? 1 : 0, tokens, Date.now() - t0,
  ]);

  try { await actualizarResumen(convId); } catch { /* no critico */ }
  return { ok: true, escalado: !!motivo, bloqueada };
}

// Resumen rodante estructurado: comprime lo antiguo para que nunca se pierda.
async function actualizarResumen(convId: number) {
  const [c] = await q<any>("SELECT resumen, resumen_hasta_msg_id FROM bot_conversaciones WHERE id=?", [convId]);
  const desde = c.resumen_hasta_msg_id ?? 0;
  const [{ n }] = await q<any>("SELECT COUNT(*) n FROM bot_mensajes WHERE conversacion_id=? AND id>?", [convId, desde]);
  if (n <= 24) return;
  const viejos = await q<any>("SELECT id, rol, texto FROM bot_mensajes WHERE conversacion_id=? AND id>? ORDER BY id LIMIT ?", [convId, desde, n - 10]);
  const r = await generar({
    contents: [{ role: "user", parts: [{ text:
      `Actualiza el resumen de esta conversación de atención al cliente. Responde SOLO un JSON con las claves: quiere, ya_se_le_dijo, datos, pendiente. Sé breve y no inventes.\nResumen previo: ${c.resumen ?? "ninguno"}\n\nMensajes nuevos:\n${viejos.map((m: any) => `${m.rol}: ${m.texto}`).join("\n")}` }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1500 },
  });
  const t = textoDe(r).replace(/```json|```/g, "").trim();
  if (!t) return;
try { JSON.parse(t); } catch { return; }
  await exec("UPDATE bot_conversaciones SET resumen=?, resumen_hasta_msg_id=? WHERE id=?", [t, viejos[viejos.length - 1].id, convId]);
}
