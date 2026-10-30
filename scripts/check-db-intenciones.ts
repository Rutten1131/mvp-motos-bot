import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
  });

  // Ver intenciones distintas en conversaciones
  const [rows] = await conn.execute(
    `SELECT DISTINCT intencion, COUNT(*) as n FROM bot_conversaciones GROUP BY intencion ORDER BY n DESC LIMIT 30`
  ) as any[];
  console.log('=== Intenciones en bot_conversaciones ===');
  rows.forEach((r: any) => {
    const hex = Buffer.from(r.intencion || '', 'utf8').toString('hex');
    console.log(`  [${r.intencion}] x${r.n}  hex=${hex.substring(0,30)}`);
  });

  // Ver últimas conversaciones
  const [convs] = await conn.execute(
    `SELECT c.id, c.empresa, c.estado, c.intencion, ct.telefono FROM bot_conversaciones c JOIN bot_contactos ct ON c.contacto_id=ct.id ORDER BY c.id DESC LIMIT 10`
  ) as any[];
  console.log('\n=== Últimas 10 conversaciones ===');
  convs.forEach((c: any) => console.log(`  id=${c.id} empresa=${c.empresa} estado=${c.estado} tel=${c.telefono} intencion=[${c.intencion}]`));

  // Ver últimos mensajes
  const [msgs] = await conn.execute(
    `SELECT id, conversacion_id, rol, SUBSTRING(texto,1,60) as texto, procesado, creado_en FROM bot_mensajes ORDER BY id DESC LIMIT 10`
  ) as any[];
  console.log('\n=== Últimos 10 mensajes ===');
  msgs.forEach((m: any) => console.log(`  id=${m.id} conv=${m.conversacion_id} rol=${m.rol} proc=${m.procesado} texto="${m.texto}"`));

  await conn.end();
}

main().catch(console.error);
