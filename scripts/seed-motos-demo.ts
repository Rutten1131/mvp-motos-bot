import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function seedMotos() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  console.log("Conectado a la base de datos para cargar catálogo de motos...");

  // Limpiar catálogo previo
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  await conn.execute("TRUNCATE TABLE bot_compatibilidad_repuestos");
  await conn.execute("TRUNCATE TABLE bot_fichas_tecnicas");
  await conn.execute("TRUNCATE TABLE bot_productos");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");

  // 1. Motocicletas
  const motos = [
    {
      codigo: "MOTO-DAY-001",
      nombre: "Daytona TANQ 125 cc",
      descripcion: "Scooter urbana automática ágil, económica y moderna ideal para tráfico y trabajo diario en Loja.",
      categoria: "motocicletas",
      subcategoria: "scooter",
      precio: 1650.0,
      stock: 5,
      ficha: {
        marca: "Daytona",
        modelo: "TANQ 125",
        cilindrada: 125,
        potencia: "8.5 HP",
        tipo_motor: "4 Tiempos Monocilíndrico",
        transmision: "Automática CVT",
        frenos_delantero: "Disco hidráulico",
        frenos_trasero: "Tambor mecánico",
        capacidad_combustible: 5.5,
        consumo_km_litro: 38,
        peso_kg: 105,
        garantia: "1 año o 10.000 km",
        tipo_uso: "urbana",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-DAY-002",
      nombre: "Daytona GP1 R 300 cc",
      descripcion: "Motocicleta deportiva con diseño agresivo, alta potencia y excelente aerodinámica.",
      categoria: "motocicletas",
      subcategoria: "deportiva",
      precio: 3850.0,
      stock: 3,
      ficha: {
        marca: "Daytona",
        modelo: "GP1 R 300",
        cilindrada: 300,
        potencia: "28 HP a 8500 rpm",
        tipo_motor: "Monocilíndrico 4T DOHC 4 Válvulas enfriado por líquido",
        transmision: "6 velocidades",
        frenos_delantero: "Doble disco ABS",
        frenos_trasero: "Disco simple ABS",
        capacidad_combustible: 14.0,
        consumo_km_litro: 28,
        peso_kg: 160,
        garantia: "1 año o 12.000 km",
        tipo_uso: "deportiva",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-DAY-003",
      nombre: "Daytona Rally 250 cc",
      descripcion: "Moto doble propósito para aventura en trochas, montaña y pavimento con suspensión invertida.",
      categoria: "motocicletas",
      subcategoria: "doble_proposito",
      precio: 2950.0,
      stock: 4,
      ficha: {
        marca: "Daytona",
        modelo: "Rally 250",
        cilindrada: 250,
        potencia: "20 HP",
        tipo_motor: "4 Tiempos Monocilíndrico con balanceador",
        transmision: "5 velocidades",
        frenos_delantero: "Disco lobulado",
        frenos_trasero: "Disco lobulado",
        capacidad_combustible: 12.5,
        consumo_km_litro: 30,
        peso_kg: 135,
        garantia: "1 año o 10.000 km",
        tipo_uso: "doble_proposito",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-SHI-001",
      nombre: "Shineray SMX 200 cc",
      descripcion: "La moto todoterreno favorita para trabajo duro y caminos rurales en la provincia de Loja.",
      categoria: "motocicletas",
      subcategoria: "doble_proposito",
      precio: 2150.0,
      stock: 6,
      ficha: {
        marca: "Shineray",
        modelo: "SMX 200",
        cilindrada: 200,
        potencia: "15 HP",
        tipo_motor: "4T a palillo de alta durabilidad",
        transmision: "5 velocidades",
        frenos_delantero: "Disco ventilado",
        frenos_trasero: "Tambor de alta resistencia",
        capacidad_combustible: 11.0,
        consumo_km_litro: 35,
        peso_kg: 120,
        garantia: "1 año o 10.000 km",
        tipo_uso: "trabajo",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-KTM-001",
      nombre: "KTM Duke 250 cc",
      descripcion: "Naked deportiva austriaca premium con chasis multitubular, aceleración y tecnología de punta.",
      categoria: "motocicletas",
      subcategoria: "deportiva",
      precio: 5290.0,
      stock: 2,
      ficha: {
        marca: "KTM",
        modelo: "Duke 250",
        cilindrada: 249,
        potencia: "30 HP",
        tipo_motor: "DOHC 4 válvulas Inyección Electrónica Bosch",
        transmision: "6 velocidades con embrague antirrebote",
        frenos_delantero: "ByBre con ABS doble canal",
        frenos_trasero: "ByBre con ABS",
        capacidad_combustible: 13.4,
        consumo_km_litro: 29,
        peso_kg: 149,
        garantia: "2 años de fábrica",
        tipo_uso: "deportiva",
        anio: 2025,
      },
    },
    {
      codigo: "MOTO-BAJ-001",
      nombre: "Bajaj Pulsar NS 200 FI ABS",
      descripcion: "Distribuidor Autorizado Bajaj: la reina del segmento 200 con triple bujía y refrigeración líquida.",
      categoria: "motocicletas",
      subcategoria: "urbana",
      precio: 3690.0,
      stock: 5,
      ficha: {
        marca: "Bajaj",
        modelo: "Pulsar NS 200 FI",
        cilindrada: 199.5,
        potencia: "24.13 HP a 9750 rpm",
        tipo_motor: "DTS-i Triple Bujía 4V Refrigeración Líquida",
        transmision: "6 velocidades",
        frenos_delantero: "Disco 300mm con ABS",
        frenos_trasero: "Disco 230mm",
        capacidad_combustible: 12.0,
        consumo_km_litro: 35,
        peso_kg: 156,
        garantia: "1 año o 20.000 km oficial Bajaj",
        tipo_uso: "urbana",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-BAJ-002",
      nombre: "Bajaj Boxer 150 cc",
      descripcion: "Distribuidor Autorizado Bajaj: motocicleta ultra resistente construida para carga y trabajo rudo.",
      categoria: "motocicletas",
      subcategoria: "trabajo",
      precio: 1850.0,
      stock: 7,
      ficha: {
        marca: "Bajaj",
        modelo: "Boxer BM 150",
        cilindrada: 144.8,
        potencia: "12 HP",
        tipo_motor: "4 Tiempos Monocilíndrico Refrigerado por Aire",
        transmision: "5 velocidades",
        frenos_delantero: "Tambor 130mm",
        frenos_trasero: "Tambor 130mm",
        capacidad_combustible: 11.0,
        consumo_km_litro: 45,
        peso_kg: 123,
        garantia: "1 año oficial Bajaj",
        tipo_uso: "trabajo",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-DUK-001",
      nombre: "Dukare Monaco 300 4V",
      descripcion: "Motocicleta doble propósito 300cc de alto desempeño, motor 4 válvulas y diseño moderno.",
      categoria: "motocicletas",
      subcategoria: "doble_proposito",
      precio: 3350.0,
      stock: 3,
      ficha: {
        marca: "Dukare",
        modelo: "Monaco 300 4V",
        cilindrada: 300,
        potencia: "25 HP",
        tipo_motor: "4 Tiempos 4 Válvulas OHC con radiador de aceite",
        transmision: "6 velocidades",
        frenos_delantero: "Disco hidráulico doble pistón",
        frenos_trasero: "Disco hidráulico",
        capacidad_combustible: 13.0,
        consumo_km_litro: 28,
        peso_kg: 142,
        garantia: "1 año o 10.000 km",
        tipo_uso: "doble_proposito",
        anio: 2026,
      },
    },
    {
      codigo: "MOTO-TUK-001",
      nombre: "TUKO Wildcat 300 cc",
      descripcion: "Máquina robusta todo terreno diseñada para caminos de sierra y trochas con gran torque.",
      categoria: "motocicletas",
      subcategoria: "doble_proposito",
      precio: 3200.0,
      stock: 4,
      ficha: {
        marca: "TUKO",
        modelo: "Wildcat 300",
        cilindrada: 300,
        potencia: "24 HP",
        tipo_motor: "Monocilíndrico 4T Balanceado",
        transmision: "5 velocidades",
        frenos_delantero: "Disco hidráulico",
        frenos_trasero: "Disco hidráulico",
        capacidad_combustible: 12.0,
        consumo_km_litro: 29,
        peso_kg: 138,
        garantia: "1 año o 10.000 km",
        tipo_uso: "doble_proposito",
        anio: 2026,
      },
    },
  ];

  for (const m of motos) {
    const [res]: any = await conn.execute(
      `INSERT INTO bot_productos (codigo, empresa, nombre, descripcion, categoria, subcategoria, precio, stock, activo)
       VALUES (?, 'motosymotos', ?, ?, ?, ?, ?, ?, 1)`,
      [m.codigo, m.nombre, m.descripcion, m.categoria, m.subcategoria, m.precio, m.stock]
    );

    const prodId = res.insertId;
    const f = m.ficha;

    await conn.execute(
      `INSERT INTO bot_fichas_tecnicas (
        producto_id, marca, modelo, cilindrada, potencia, tipo_motor, transmision,
        frenos_delantero, frenos_trasero, capacidad_combustible, consumo_km_litro, peso_kg, garantia, tipo_uso, anio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prodId,
        f.marca,
        f.modelo,
        f.cilindrada,
        f.potencia,
        f.tipo_motor,
        f.transmision,
        f.frenos_delantero,
        f.frenos_trasero,
        f.capacidad_combustible,
        f.consumo_km_litro,
        f.peso_kg,
        f.garantia,
        f.tipo_uso,
        f.anio,
      ]
    );
  }

  console.log(`✅ ${motos.length} Motocicletas con ficha técnica insertadas.`);

  // 2. Repuestos y Compatibilidades
  const repuestos = [
    {
      codigo: "REP-PAS-SHI",
      nombre: "Pastillas de Freno Delanteras Shineray SMX 200",
      descripcion: "Juego de pastillas de freno cerámicas de alta fricción para Shineray SMX 200 y modelos afines.",
      categoria: "repuestos",
      subcategoria: "frenos",
      precio: 14.5,
      stock: 15,
      compat: [
        { marca: "Shineray", modelo: "SMX 200", desde: 2018, hasta: 2026 },
        { marca: "Daytona", modelo: "Rally 250", desde: 2020, hasta: 2026 },
      ],
    },
    {
      codigo: "REP-FIL-DAY",
      nombre: "Filtro de Aire Daytona TANQ 125",
      descripcion: "Filtro de aire de alto flujo original de reposición para scooter Daytona TANQ 125.",
      categoria: "repuestos",
      subcategoria: "filtros",
      precio: 9.0,
      stock: 12,
      compat: [{ marca: "Daytona", modelo: "TANQ 125", desde: 2022, hasta: 2026 }],
    },
    {
      codigo: "REP-KIT-BAJ",
      nombre: "Kit de Arrastre / Cadena Bajaj Pulsar NS 200",
      descripcion: "Cadena reforzada con oring, piñón y corona paso 520 de alta durabilidad original Bajaj.",
      categoria: "repuestos",
      subcategoria: "transmision",
      precio: 48.0,
      stock: 8,
      compat: [
        { marca: "Bajaj", modelo: "Pulsar NS 200", desde: 2015, hasta: 2026 },
        { marca: "Bajaj", modelo: "Pulsar NS 200 FI", desde: 2018, hasta: 2026 },
      ],
    },
    {
      codigo: "REP-BUI-NGK",
      nombre: "Bujía NGK Iridium CPR8EAIX-9",
      descripcion: "Bujía de alto rendimiento de iridio para encendido óptimo en motos de 150 a 300 cc.",
      categoria: "repuestos",
      subcategoria: "electrico",
      precio: 12.0,
      stock: 25,
      compat: [
        { marca: "Bajaj", modelo: "Pulsar NS 200", desde: 2016, hasta: 2026 },
        { marca: "KTM", modelo: "Duke 250", desde: 2018, hasta: 2026 },
        { marca: "Daytona", modelo: "GP1 R 300", desde: 2020, hasta: 2026 },
      ],
    },
  ];

  for (const r of repuestos) {
    const [res]: any = await conn.execute(
      `INSERT INTO bot_productos (codigo, empresa, nombre, descripcion, categoria, subcategoria, precio, stock, activo)
       VALUES (?, 'motosymotos', ?, ?, ?, ?, ?, ?, 1)`,
      [r.codigo, r.nombre, r.descripcion, r.categoria, r.subcategoria, r.precio, r.stock]
    );

    const repId = res.insertId;
    for (const c of r.compat) {
      await conn.execute(
        `INSERT INTO bot_compatibilidad_repuestos (repuesto_id, marca_moto, modelo_moto, anio_desde, anio_hasta)
         VALUES (?, ?, ?, ?, ?)`,
        [repId, c.marca, c.modelo, c.desde, c.hasta]
      );
    }
  }

  console.log(`✅ ${repuestos.length} Repuestos con reglas de compatibilidad insertados.`);

  // 3. Accesorios, Lubricantes y MUC-OFF
  const accesorios = [
    {
      codigo: "ACC-CAS-001",
      nombre: "Casco Integral Certificado DOT / ECE Shaft Pro",
      descripcion: "Casco integral con visor anti-scratch, ventilación multipunto y certificación internacional.",
      categoria: "accesorios",
      subcategoria: "cascos",
      precio: 65.0,
      stock: 10,
    },
    {
      codigo: "ACC-GUA-001",
      nombre: "Guantes de Protección con Nudillos de Carbono",
      descripcion: "Guantes tácticos para motociclista con grip antideslizante y protección de impacto.",
      categoria: "accesorios",
      subcategoria: "indumentaria",
      precio: 22.0,
      stock: 20,
    },
    {
      codigo: "ACC-MAL-001",
      nombre: "Maletero Trasero 45 Litros con Base Universal",
      descripcion: "Baúl resistente al agua para dos cascos, cerradura con llave y reflectivos de seguridad.",
      categoria: "accesorios",
      subcategoria: "maleteros",
      precio: 55.0,
      stock: 6,
    },
    {
      codigo: "MUC-CLN-001",
      nombre: "Limpiador Limpieza Total MUC-OFF Nano Tech 1L",
      descripcion: "Fórmula biodegradable premium MUC-OFF que penetra la suciedad y grasa a nivel molecular sin dañar la pintura.",
      categoria: "limpieza",
      subcategoria: "muc_off",
      precio: 18.0,
      stock: 14,
    },
    {
      codigo: "MUC-LUB-001",
      nombre: "Lubricante de Cadena MUC-OFF All-Weather 400ml",
      descripcion: "Lubricante sintético repelente de agua y polvo para cadenas de motos expuestas a climas variables.",
      categoria: "lubricantes",
      subcategoria: "muc_off",
      precio: 16.5,
      stock: 18,
    },
    {
      codigo: "ACE-MOT-001",
      nombre: "Aceite de Motor Motul 7100 10W40 Sintético 1L",
      descripcion: "Aceite 100% sintético con tecnología Ester para motos 4 tiempos de alta exigencia.",
      categoria: "lubricantes",
      subcategoria: "aceite",
      precio: 19.5,
      stock: 25,
    },
  ];

  for (const a of accesorios) {
    await conn.execute(
      `INSERT INTO bot_productos (codigo, empresa, nombre, descripcion, categoria, subcategoria, precio, stock, activo)
       VALUES (?, 'motosymotos', ?, ?, ?, ?, ?, ?, 1)`,
      [a.codigo, a.nombre, a.descripcion, a.categoria, a.subcategoria, a.precio, a.stock]
    );
  }

  console.log(`✅ ${accesorios.length} Accesorios, lubricantes y productos MUC-OFF insertados.`);
  console.log("\n🚀 Catálogo completo de MOTOS & MOTOS sembrado exitosamente en MariaDB.");

  await conn.end();
}

seedMotos().catch((e) => {
  console.error("❌ Error sembrando catálogo:", e);
  process.exit(1);
});

