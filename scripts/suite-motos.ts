import { q, exec } from "../lib/db";
import { procesarConversacion } from "../lib/bot";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const TEST_CASES = [
  { id: 1, name: "Presupuesto $1.500 para trabajar", msg: "Hola, busco una moto para trabajar, tengo un presupuesto de $1.500, ¿qué me recomiendas?" },
  { id: 2, name: "Motos de 200cc disponibles", msg: "¿Qué motos de 200cc tienen disponibles?" },
  { id: 3, name: "Comparar Daytona GP1 R 300 vs Shineray SMX 200", msg: "¿Qué diferencia hay entre la Daytona GP1 R 300 y la Shineray SMX 200?" },
  { id: 4, name: "Moto inexistente (Honda CB300)", msg: "¿Tienen la Honda CB300 en stock?" },
  { id: 5, name: "Precio sin especificar modelo", msg: "¿Cuánto cuesta una moto?" },
  { id: 6, name: "Sucursales y horarios", msg: "¿Dónde están ubicados y qué horario tienen?" },
  { id: 7, name: "Cotizar 2 motos", msg: "Quiero cotizar una Daytona TANQ 125 y una Shineray SMX 200. Mi nombre es Juan Pérez de Loja." },
  { id: 8, name: "Cotizar moto + accesorios", msg: "Cotiza una Bajaj Boxer 150 con casco y guantes. Me llamo Carlos Torres de Loja." },
  { id: 9, name: "Solicitar descuento 20%", msg: "Quiero la KTM Duke 250 pero con 20% de descuento al contado hoy" },
  { id: 10, name: "Crédito directo / financiamiento", msg: "¿Cuánto tengo que dar de entrada para una moto a crédito?" },
  { id: 11, name: "Costo de matricula", msg: "¿Cuánto cuesta matricular una moto y ustedes ayudan con el trámite?" },
  { id: 12, name: "Cobertura garantía Bajaj", msg: "¿Qué garantía tienen las motos Bajaj y qué cubre exactamente?" },
  { id: 13, name: "Repuesto pastillas freno Shineray", msg: "Necesito pastillas de freno delanteras para una Shineray SMX 200 año 2024" },
  { id: 14, name: "Compatibilidad de pieza", msg: "¿El filtro de aire del Daytona TANQ 125 le sirve a una Daytona Rally 250?" },
  { id: 15, name: "Casco por presupuesto $70", msg: "Busco un casco certificado con presupuesto de máximo $70" },
  { id: 16, name: "Agendar servicio técnico", msg: "Quiero agendar mantenimiento para mi Pulsar NS 200, ¿tienen taller?" },
  { id: 17, name: "Falla mecánica peligrosa", msg: "Iba manejando y los frenos casi no responden, ¿qué hago?" },
  { id: 18, name: "Reclamo por garantía", msg: "Compré una moto hace un mes y ya bota aceite del motor, exijo la garantía" },
  { id: 19, name: "Hablar con gerente / humano", msg: "Deseo hablar directamente con el gerente o dueño del negocio" },
  { id: 20, name: "Cotización ficticia moto inexistente", msg: "Cotízame formalmente una Yamaha MT-09 2026 a mi nombre Pedro Loaiza" },
];

// Extrae tools_llamadas de forma segura sin importar si viene como string o objeto
function parseTools(raw: any): { nombre: string }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

async function runSuite() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🏁 SUITE DE 20 PRUEBAS DE FUEGO — MOTOS & MOTOS (LOJA, ECUADOR)");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const results: { id: number; nombre: string; tools: string[]; durMs: number; bloqueada: boolean; ok: boolean; error?: string }[] = [];

  for (const tc of TEST_CASES) {
    const testJid = `5939900000${String(tc.id).padStart(2, "0")}@s.whatsapp.net`;

    try {
      // Crear / reusar contacto de prueba
      const contactoRows = await q<{ id: number }>("SELECT id FROM bot_contactos WHERE telefono=?", [testJid]);
      let contactoId = contactoRows[0]?.id;
      if (!contactoId) {
        const res = await exec("INSERT INTO bot_contactos (telefono, nombre) VALUES (?, ?)", [testJid, `Tester ${tc.id}`]);
        contactoId = res.insertId;
      }

      // Conversación fresca
      const cRes = await exec(
        "INSERT INTO bot_conversaciones (contacto_id, empresa, estado, bot_activo) VALUES (?, 'motosymotos', 'NUEVO', 1)",
        [contactoId]
      );
      const convId = cRes.insertId;

      // Mensaje del cliente
      await exec(
        "INSERT INTO bot_mensajes (conversacion_id, rol, texto, procesado) VALUES (?, 'cliente', ?, 0)",
        [convId, tc.msg]
      );

      // Procesar bot
      const tStart = Date.now();
      await procesarConversacion(convId).catch(() => {/* Evolution puede fallar en local — ignorar */});
      const dur = Date.now() - tStart;

      // Respuesta del bot (puede ser vacía si Evolution falló)
      const botRows = await q<{ texto: string }>(
        "SELECT texto FROM bot_mensajes WHERE conversacion_id=? AND rol='bot' ORDER BY id DESC LIMIT 1",
        [convId]
      );

      // Traza más reciente
      const trazaRows = await q<{ tools_llamadas: any; bloqueada: number }>(
        "SELECT tools_llamadas, bloqueada FROM bot_trazas WHERE conversacion_id=? ORDER BY id DESC LIMIT 1",
        [convId]
      );

      const traza = trazaRows[0];
      const toolsUsadas = parseTools(traza?.tools_llamadas).map((t: any) => t.nombre ?? String(t));
      const respuesta = botRows[0]?.texto ?? "[Sin respuesta — Evolution desconectado]";
      const bloqueada = (traza?.bloqueada ?? 0) === 1;
      const ok = respuesta.length > 15 && !bloqueada;

      console.log(`\n── TEST ${tc.id}/20: ${tc.name}`);
      console.log(`   👤 "${tc.msg.slice(0, 80)}${tc.msg.length > 80 ? "..." : ""}"`);
      console.log(`   ⚙️  Tools: [${toolsUsadas.join(", ") || "ninguna"}] | ⏱ ${dur}ms | Bloqueada: ${bloqueada ? "SÍ 🛡" : "no"}`);
      console.log(`   🤖 ${respuesta.slice(0, 200)}${respuesta.length > 200 ? "..." : ""}`);

      results.push({ id: tc.id, nombre: tc.name, tools: toolsUsadas, durMs: dur, bloqueada, ok });
    } catch (err: any) {
      console.error(`   ❌ Error en Test ${tc.id}:`, err?.message?.slice(0, 120));
      results.push({ id: tc.id, nombre: tc.name, tools: [], durMs: 0, bloqueada: false, ok: false, error: err?.message });
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📊 RESUMEN FINAL — SUITE MOTOS & MOTOS");
  console.log("═══════════════════════════════════════════════════════════════");
  const aprobadas = results.filter((r) => r.ok).length;
  console.log(`✅ Aprobadas: ${aprobadas}/20  |  ⚠️  Fallidas: ${20 - aprobadas}/20\n`);
  results.forEach((r) => {
    const icon = r.error ? "❌" : r.ok ? "✅" : "🛡️";
    const tools = r.tools.length ? r.tools.join(",") : "directo";
    const detail = r.error ? r.error.slice(0, 60) : `${r.durMs}ms`;
    console.log(`  ${icon} [${r.id.toString().padStart(2, "0")}] ${r.nombre.padEnd(38)} (${tools}) ${detail}`);
  });

  process.exit(0);
}

runSuite().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
