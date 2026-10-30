import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { exec, q } from "../lib/db";

async function run() {
  await exec('UPDATE bot_conversaciones SET intencion = "Conversación general" WHERE intencion LIKE "Conversaci%"');
  await exec('UPDATE bot_conversaciones SET intencion = "Cotización generada" WHERE intencion LIKE "Cotizaci%"');
  await exec('UPDATE bot_conversaciones SET intencion = "Pasó a administración" WHERE intencion LIKE "Pas%administraci%"');
  await exec('UPDATE bot_conversaciones SET intencion = "Pasó a ventas" WHERE intencion LIKE "Pas%ventas%"');

  const after = await q<{ intencion: string }>('SELECT DISTINCT intencion FROM bot_conversaciones WHERE intencion IS NOT NULL');
  console.log("Intenciones limpias en DB:");
  console.log(after.map(a => a.intencion));
  process.exit(0);
}

run().catch(console.error);

