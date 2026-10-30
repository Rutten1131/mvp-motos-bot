// Script temporal para ejecutar schema + seed contra la nueva DB de Motos & Motos
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  const conn = await mysql.createConnection({
    host: 'mysql.us.stackcp.com',
    port: 45609,
    user: 'mvp-motos-35303938b256',
    password: 'tncwfl-iivgWe-mqkr7r',
    database: 'mvp-motos-35303938b256',
    connectTimeout: 20000,
    multipleStatements: true,
  });

  console.log('✅ Conectado a la DB de Motos & Motos');

  // Ejecutar schema
  const schema = fs.readFileSync(path.join(__dirname, '../sql/001_schema.sql'), 'utf8');
  console.log('⏳ Ejecutando schema...');
  await conn.query(schema);
  console.log('✅ Schema aplicado');

  // Ejecutar seed
  const seed = fs.readFileSync(path.join(__dirname, '../sql/002_seed.sql'), 'utf8');
  console.log('⏳ Ejecutando seed...');
  await conn.query(seed);
  console.log('✅ Seed aplicado');

  // Verificar tablas creadas
  const [tables] = await conn.query("SHOW TABLES");
  console.log('\n📋 Tablas en la DB:');
  tables.forEach(t => console.log(' -', Object.values(t)[0]));

  // Verificar datos seed
  const [sucursales] = await conn.query("SELECT nombre, ciudad FROM bot_sucursales");
  console.log('\n🏪 Sucursales cargadas:');
  sucursales.forEach(s => console.log(` - ${s.nombre} (${s.ciudad})`));

  const [faqs] = await conn.query("SELECT COUNT(*) as total FROM bot_faqs");
  console.log(`\n❓ FAQs cargadas: ${faqs[0].total}`);

  const [config] = await conn.query("SELECT clave FROM bot_config");
  console.log('\n⚙️  Config keys:', config.map(c => c.clave).join(', '));

  await conn.end();
  console.log('\n🏍️  Base de datos Motos & Motos lista!');
}

run().catch(e => {
  console.error('❌ ERROR:', e.message);
  process.exit(1);
});

