-- MOTOS & MOTOS — Seed inicial (Loja, Ecuador)
SET NAMES utf8mb4;

DELETE FROM bot_sucursales;
DELETE FROM bot_promociones;
DELETE FROM bot_faqs;
DELETE FROM bot_config;

-- ========== SUCURSALES ==========
INSERT INTO bot_sucursales (empresa, nombre, direccion, ciudad, telefono, horario, activa) VALUES
('motosymotos',
 'Motos & Motos — Matriz',
 'Av. 8 de Diciembre y Jaramijó (cerca del Terminal Terrestre Reina del Cisne)',
 'Loja',
 '095 979 5341',
 '{"lun-vie":"08:30-19:00","sab":"08:30-14:00","dom":null}',
 1),
('motosymotos',
 'Motos & Motos — Sucursal',
 'Av. Manuel Agustín Aguirre entre 10 de Agosto y José Antonio Eguiguren (frente a los Bomberos)',
 'Loja',
 '095 979 5341',
 '{"lun-vie":"08:30-19:00","sab":"08:30-14:00","dom":null}',
 1);

-- ========== PROMOCIONES ==========
INSERT INTO bot_promociones (empresa, titulo, descripcion, desde, hasta, activa) VALUES
('motosymotos',
 'Distribuidores Autorizados Bajaj',
 'Somos distribuidores oficiales Bajaj en Loja y Saraguro. Garantía de fábrica y repuestos originales.',
 '2026-01-01','2026-12-31', 1),
('motosymotos',
 'Multimarca — Todas las marcas a los mejores precios',
 'Manejamos Bajaj, Daytona, Shineray, KTM, Factory Bike, Dukare, TUKO, Ranger y más. Consulte disponibilidad.',
 '2026-01-01','2026-12-31', 1),
('motosymotos',
 'Financiamiento disponible',
 'Adquiere tu moto con opciones de crédito. Consulta con nuestros asesores las condiciones y cuotas disponibles.',
 '2026-01-01','2026-12-31', 1);

-- ========== FAQs ==========
INSERT INTO bot_faqs (empresa, tema, pregunta, respuesta) VALUES
('motosymotos','identidad','¿Qué es Motos & Motos?',
 'Motos & Motos es un concesionario multimarca de motocicletas en Loja, Ecuador. Somos distribuidores autorizados Bajaj y comercializamos también Daytona, Shineray, KTM, Factory Bike, Dukare, TUKO, Ranger y otras marcas. Además ofrecemos repuestos, accesorios y servicio técnico profesional.'),

('motosymotos','sucursales','¿Dónde están ubicados?',
 'Tenemos 2 puntos de atención en Loja: 1) Matriz: Av. 8 de Diciembre y Jaramijó, cerca del Terminal Terrestre Reina del Cisne. 2) Sucursal: Av. Manuel Agustín Aguirre entre 10 de Agosto y José Antonio Eguiguren, frente a los Bomberos.'),

('motosymotos','horario','¿Cuál es el horario de atención?',
 'Atendemos de lunes a viernes de 08:30 a 19:00 y los sábados de 08:30 a 14:00. Los domingos no hay atención presencial, pero puede enviarnos su consulta por aquí y le responderemos el siguiente día hábil.'),

('motosymotos','contacto','¿Cuál es su número de WhatsApp?',
 'Nuestro número de WhatsApp y teléfono principal es 095 979 5341.'),

('motosymotos','redes','¿Tienen redes sociales?',
 'Sí, puede seguirnos en Instagram y Facebook como @motosymotosec. Publicamos regularmente nuevos modelos, promociones y novedades.'),

('motosymotos','marcas','¿Qué marcas de motos manejan?',
 'Somos distribuidores autorizados Bajaj y también trabajamos con Daytona, Shineray, KTM, Factory Bike, Dukare, TUKO, Ranger y otras marcas. Consulte disponibilidad del modelo específico que le interesa.'),

('motosymotos','bajaj','¿Son distribuidores oficiales Bajaj?',
 'Sí, Motos & Motos figura en el directorio oficial de distribuidores autorizados Bajaj Ecuador, tanto para Loja como para Saraguro. Puede verificarlo en bajajecuador.com/servicios'),

('motosymotos','financiamiento','¿Venden motos a crédito o con financiamiento?',
 'Sí, manejamos opciones de financiamiento. Para conocer las condiciones actuales de entrada, cuotas y plazos disponibles, comuníquese con uno de nuestros asesores comerciales al 095 979 5341. Le ayudamos a encontrar el plan que mejor se adapte a su presupuesto.'),

('motosymotos','garantia','¿Qué garantía tienen las motocicletas?',
 'La garantía varía según la marca y el modelo. Las marcas que distribuimos ofrecen garantía de fábrica. Le recomendamos consultar la garantía específica del modelo de su interés con nuestro equipo de ventas.'),

('motosymotos','repuestos','¿Venden repuestos?',
 'Sí, contamos con un área de repuestos y partes para las principales marcas que distribuimos. Es importante indicar la marca, el modelo exacto y el año de su motocicleta para verificar la compatibilidad correcta.'),

('motosymotos','accesorios','¿Qué accesorios tienen disponibles?',
 'Disponemos de cascos, guantes, maleteros, espejos, iluminación adicional, protecciones, indumentaria y productos de mantenimiento. También manejamos la línea MUC-OFF para limpieza, lubricación y cuidado profesional de motocicletas.'),

('motosymotos','muc_off','¿Qué es MUC-OFF?',
 'MUC-OFF es una línea premium de productos para el cuidado y mantenimiento de motocicletas: limpiadores, desengrasantes, lubricantes de cadena, ceras y protectores de alta calidad para mantener su moto en óptimas condiciones.'),

('motosymotos','servicio_tecnico','¿Tienen taller de servicio técnico?',
 'Sí, contamos con servicio técnico para mantenimiento preventivo, diagnóstico y reparación de motocicletas. Puede consultarnos para agendar una cita o hacer una consulta sobre su moto.'),

('motosymotos','matricula','¿Me ayudan con los trámites de matrícula?',
 'Para los trámites de matrícula y demás gestiones legales de su nueva motocicleta, nuestros asesores le orientan con el proceso correspondiente. Consulte los detalles según el modelo adquirido.'),

('motosymotos','pagos','¿Qué formas de pago aceptan?',
 'Aceptamos efectivo, transferencias bancarias y tarjetas. Para compras a crédito manejamos planes de financiamiento. Consulte con nuestros asesores las condiciones y formas de pago vigentes.'),

('motosymotos','delivery','¿Hacen envíos a otras ciudades?',
 'Para consultas sobre disponibilidad de envío o despacho a otras ciudades, comuníquese directamente con nuestros asesores al 095 979 5341.'),

('motosymotos','infantil','¿Tienen motos para niños?',
 'Sí, disponemos de motocicletas infantiles. Consulte disponibilidad de modelos y precios con nuestros asesores.'),

('motosymotos','saraguro','¿Atienden en Saraguro también?',
 'Sí, además de nuestras 2 sucursales en Loja, somos distribuidores autorizados Bajaj en Saraguro. Consulte disponibilidad y atención en esa ciudad.'),

('motosymotos','cotizacion','¿Puedo pedir una cotización?',
 'Por supuesto. Indíqueme el modelo o los modelos que le interesan, la cantidad y cualquier accesorio adicional, y le preparo una cotización formal de inmediato.'),

('motosymotos','reputacion','¿Cómo están calificados en Google?',
 'Motos & Motos tiene una calificación de 4.2 sobre 5 estrellas en Google Maps con más de 35 reseñas de clientes. Puede revisarlas directamente en Google Maps buscando "Motos y Motos Loja".');

-- ========== CONFIG ==========
INSERT INTO bot_config (clave, valor) VALUES
('horario_asesores',
 '{"zona":"America/Guayaquil","lun-vie":["08:30","19:00"],"sab":["08:30","14:00"],"dom":null}'),
('mensaje_fuera_horario',
 '"Nuestros asesores atienden de lunes a viernes de 08:30 a 19:00 y los sábados de 08:30 a 14:00. Le responderemos al inicio de la próxima jornada. 🏍️"'),
('empresa_nombre', '"Motos & Motos"'),
('empresa_whatsapp', '"095 979 5341"'),
('empresa_instagram', '"@motosymotosec"');
