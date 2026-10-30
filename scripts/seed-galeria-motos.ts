import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { exec } from "../lib/db";

async function main() {
  console.log("Iniciando carga de categorías y 20 imágenes del catálogo visual...");

  // 1. Limpiar y cargar categorías principales
  await exec("DELETE FROM bot_categorias_img");
  const categorias = [
    { cat: 'motocicletas', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80', desc: 'Motos nuevas deportivas, urbanas, doble propósito y scooters' },
    { cat: 'repuestos', img: 'https://images.unsplash.com/photo-1589148938909-4d241c91ee52?w=800&auto=format&fit=crop&q=80', desc: 'Repuestos originales y compatibles para todas las marcas' },
    { cat: 'accesorios', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80', desc: 'Cascos certificados, guantes con protección y maleteros' },
    { cat: 'limpieza', img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80', desc: 'Productos de limpieza especializados MUC-OFF' },
    { cat: 'lubricantes', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', desc: 'Aceites Motul sintéticos y lubricantes de cadena' }
  ];

  for (const c of categorias) {
    await exec(
      "INSERT INTO bot_categorias_img (categoria, url_imagen, descripcion) VALUES (?, ?, ?)",
      [c.cat, c.img, c.desc]
    );
  }
  console.log("Categorias registradas con exito.");

  // 2. Limpiar y cargar 20 fotos etiquetadas y vinculadas
  await exec("DELETE FROM bot_categorias_galeria");
  const fotos = [
    { pId: 1, cat: 'motocicletas', etiq: 'daytona tanq 125 scooter automatica negra roja urbana', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80' },
    { pId: 2, cat: 'motocicletas', etiq: 'daytona gp1 r 300 deportiva pista 300cc carenada', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80' },
    { pId: 3, cat: 'motocicletas', etiq: 'daytona rally 250 enduro cross doble proposito trail', url: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?w=800&auto=format&fit=crop&q=80' },
    { pId: 4, cat: 'motocicletas', etiq: 'shineray smx 200 doble proposito todo terreno palillo roja', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80' },
    { pId: 5, cat: 'motocicletas', etiq: 'ktm duke 250 naked deportiva naranja abs 250cc duke', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&auto=format&fit=crop&q=80' },
    { pId: 6, cat: 'motocicletas', etiq: 'bajaj pulsar ns 200 fi abs naked negra azul urbana inyeccion', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80' },
    { pId: 7, cat: 'motocicletas', etiq: 'bajaj boxer 150 economica trabajo carga resistente negra', url: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=800&auto=format&fit=crop&q=80' },
    { pId: 8, cat: 'motocicletas', etiq: 'dukare monaco 300 4v adventure trail doble proposito touring', url: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?w=800&auto=format&fit=crop&q=80' },
    { pId: 9, cat: 'motocicletas', etiq: 'tuko wildcat 300 rally offroad enduro trail potente', url: 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80' },
    { pId: 10, cat: 'repuestos', etiq: 'pastillas de freno delanteras shineray smx 200 ceramica', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop&q=80' },
    { pId: 11, cat: 'repuestos', etiq: 'filtro de aire daytona tanq 125 scooter repuesto motor', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80' },
    { pId: 12, cat: 'repuestos', etiq: 'kit de arrastre cadena catalina pinon bajaj pulsar ns 200 o-ring', url: 'https://images.unsplash.com/photo-1589148938909-4d241c91ee52?w=800&auto=format&fit=crop&q=80' },
    { pId: 13, cat: 'repuestos', etiq: 'bujia ngk iridium cpr8eaix-9 encendido chispa bajaj ktm', url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80' },
    { pId: 14, cat: 'accesorios', etiq: 'casco integral certificado dot ece shaft pro negro mate visor', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80' },
    { pId: 15, cat: 'accesorios', etiq: 'guantes de proteccion con nudillos de carbono cuero ventilados', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80' },
    { pId: 16, cat: 'accesorios', etiq: 'maletero trasero 45 litros base universal baul cofre', url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&auto=format&fit=crop&q=80' },
    { pId: 17, cat: 'limpieza', etiq: 'limpiador total muc-off nano tech 1l lavado motos desengrasante', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80' },
    { pId: 18, cat: 'lubricantes', etiq: 'lubricante de cadena muc-off all-weather 400ml aerosol cera', url: 'https://images.unsplash.com/photo-1527383418406-f85a3b146499?w=800&auto=format&fit=crop&q=80' },
    { pId: 19, cat: 'lubricantes', etiq: 'aceite de motor motul 7100 10w40 sintetico 1l 4t ester', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80' },
    { pId: 6, cat: 'motocicletas', etiq: 'pulsar ns 200 detalle motor tablero escape velocimetro', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80' }
  ];

  for (const f of fotos) {
    await exec(
      "INSERT INTO bot_categorias_galeria (producto_id, categoria, url_imagen, etiquetas) VALUES (?, ?, ?, ?)",
      [f.pId, f.cat, f.url, f.etiq]
    );
  }

  console.log("20 imagenes cargadas y etiquetadas exitosamente.");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

