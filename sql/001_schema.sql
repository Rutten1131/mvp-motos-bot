-- MOTOS & MOTOS — Schema adaptado (MySQL/MariaDB)
-- Migrado desde Santiago Papelería
SET NAMES utf8mb4;

-- ========== CRM / CONVERSACIONES ==========
CREATE TABLE IF NOT EXISTS bot_contactos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(32) NOT NULL,
  nombre VARCHAR(120) NULL,
  datos JSON NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_conversaciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contacto_id BIGINT UNSIGNED NOT NULL,
  empresa ENUM('motosymotos') NULL DEFAULT 'motosymotos',
  estado VARCHAR(32) NOT NULL DEFAULT 'SALUDO',
  bot_activo TINYINT(1) NOT NULL DEFAULT 1,
  resumen TEXT NULL,
  resumen_hasta_msg_id BIGINT UNSIGNED NULL,
  intentos_fallidos INT NOT NULL DEFAULT 0,
  procesando TINYINT(1) NOT NULL DEFAULT 0,
  lock_at DATETIME NULL,
  motivo_escalamiento VARCHAR(255) NULL,
  resumen_agente TEXT NULL,
  asignado_a VARCHAR(80) NULL,
  ultimo_msg_en DATETIME(3) NULL,
  intencion VARCHAR(80) NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contacto (contacto_id),
  KEY idx_estado (estado, bot_activo),
  CONSTRAINT fk_conv_contacto FOREIGN KEY (contacto_id) REFERENCES bot_contactos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_mensajes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversacion_id BIGINT UNSIGNED NOT NULL,
  rol ENUM('cliente','bot','agente') NOT NULL,
  texto TEXT NOT NULL,
  wa_message_id VARCHAR(128) NULL,
  procesado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_wa_msg (wa_message_id),
  KEY idx_conv_id (conversacion_id, id),
  KEY idx_pendientes (conversacion_id, rol, procesado),
  CONSTRAINT fk_msg_conv FOREIGN KEY (conversacion_id) REFERENCES bot_conversaciones(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== CATÁLOGO DE PRODUCTOS (motos, repuestos, accesorios) ==========
CREATE TABLE IF NOT EXISTS bot_sucursales (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa ENUM('motosymotos') NOT NULL DEFAULT 'motosymotos',
  nombre VARCHAR(120) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(80) NOT NULL,
  telefono VARCHAR(40) NULL,
  horario JSON NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  KEY idx_emp_ciudad (empresa, ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_promociones (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa ENUM('motosymotos') NOT NULL DEFAULT 'motosymotos',
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  desde DATE NOT NULL,
  hasta DATE NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(40) NULL,
  empresa ENUM('motosymotos') NOT NULL DEFAULT 'motosymotos',
  nombre VARCHAR(200) NOT NULL,
  descripcion VARCHAR(500) NULL,
  categoria VARCHAR(80) NOT NULL,        -- 'motocicletas','repuestos','accesorios','lubricantes','limpieza','infantil'
  subcategoria VARCHAR(80) NULL,         -- 'urbana','doble_proposito','deportiva','trabajo','scooter','custom'
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  precio_iva DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(precio * 1.15, 2)) STORED,
  stock INT NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  FULLTEXT KEY ft_prod (nombre, descripcion, categoria, subcategoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== FICHA TÉCNICA (adjunta a motocicletas en bot_productos) ==========
CREATE TABLE IF NOT EXISTS bot_fichas_tecnicas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  marca VARCHAR(60) NOT NULL,
  modelo VARCHAR(120) NOT NULL,
  cilindrada INT NULL,                          -- cc
  potencia VARCHAR(60) NULL,                    -- ej: "18.5 HP a 8500 rpm"
  tipo_motor VARCHAR(80) NULL,                  -- ej: "Monocilíndrico 4T SOHC"
  transmision VARCHAR(60) NULL,                 -- ej: "5 velocidades"
  frenos_delantero VARCHAR(100) NULL,
  frenos_trasero VARCHAR(100) NULL,
  suspension_delantera VARCHAR(100) NULL,
  suspension_trasera VARCHAR(100) NULL,
  capacidad_combustible DECIMAL(4,1) NULL,      -- litros
  consumo_km_litro INT NULL,
  peso_kg INT NULL,
  garantia VARCHAR(120) NULL,
  tipo_uso VARCHAR(60) NULL,                    -- 'urbana','doble_proposito','deportiva','trabajo','infantil','scooter'
  anio INT NULL,
  KEY idx_prod (producto_id),
  CONSTRAINT fk_ft_prod FOREIGN KEY (producto_id) REFERENCES bot_productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== COMPATIBILIDAD DE REPUESTOS ==========
CREATE TABLE IF NOT EXISTS bot_compatibilidad_repuestos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  repuesto_id INT UNSIGNED NOT NULL,
  marca_moto VARCHAR(60) NOT NULL,
  modelo_moto VARCHAR(120) NOT NULL,
  anio_desde YEAR NULL,
  anio_hasta YEAR NULL,
  KEY idx_rep (repuesto_id),
  CONSTRAINT fk_comp_rep FOREIGN KEY (repuesto_id) REFERENCES bot_productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== FAQS ==========
CREATE TABLE IF NOT EXISTS bot_faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa ENUM('motosymotos') NOT NULL DEFAULT 'motosymotos',
  tema VARCHAR(60) NOT NULL,
  pregunta VARCHAR(255) NOT NULL,
  respuesta TEXT NOT NULL,
  FULLTEXT KEY ft_faq (tema, pregunta, respuesta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== CONFIG ==========
CREATE TABLE IF NOT EXISTS bot_config (
  clave VARCHAR(60) PRIMARY KEY,
  valor JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== GALERÍA VISUAL ==========
CREATE TABLE IF NOT EXISTS bot_categorias_img (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria VARCHAR(80) NOT NULL,
  url_imagen VARCHAR(500) NOT NULL,
  descripcion VARCHAR(200) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_categorias_galeria (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria VARCHAR(80) NOT NULL,
  url_imagen VARCHAR(500) NOT NULL,
  etiquetas VARCHAR(300) NULL,
  producto_id INT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== DEPURACIÓN Y TRAZABILIDAD ==========
CREATE TABLE IF NOT EXISTS bot_trazas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversacion_id BIGINT UNSIGNED NOT NULL,
  prompt JSON NULL,
  respuesta JSON NULL,
  tools_llamadas JSON NULL,
  bloqueada TINYINT(1) NOT NULL DEFAULT 0,
  tokens INT NULL,
  latencia_ms INT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_conv (conversacion_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_eventos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversacion_id BIGINT UNSIGNED NOT NULL,
  tipo VARCHAR(40) NOT NULL,
  detalle JSON NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_conv (conversacion_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
