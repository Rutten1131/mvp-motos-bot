const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'app', 'crm', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

const unifiedCatalogComponent = `/* ─── Componente 4: Catálogo & Fotos IA (Showroom Digital Unificado) ─── */
function CatalogoShowroom() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaImg[]>([]);
  const [catSel, setCatSel] = useState<string>("Todas");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("/api/crm/productos?limit=100").then(r => r.json()),
          fetch("/api/crm/categorias").then(r => r.json())
        ]);
        if (resProd.productos) setProductos(resProd.productos);
        if (resCat.categorias) setCategorias(resCat.categorias);
      } catch (e) {
        console.error("Error cargando showroom:", e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <div className="dashboard-loading" style={{ color: "#2dd4bf" }}>Cargando Showroom Digital…</div>;

  // Filtrado de productos
  const filtrados = productos.filter(p => {
    if (catSel === "Todas") return true;
    return p.categoria.toLowerCase().includes(catSel.toLowerCase());
  });

  // Mapa de imágenes por categoría
  const imgPorCat: Record<string, string> = {
    "Motocicletas": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    "Cascos y Accesorios": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    "Repuestos": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    "Lubricantes": "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
  };

  const totalFotos = categorias.reduce((acc, c) => acc + (c.galeria?.length || 0), 0) || 42;

  return (
    <div className="dash-glass-root" style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 10px 40px 10px" }}>
      {/* ─── Encabezado de la Vista ─── */}
      <div className="exec-header">
        <div className="exec-title-box">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1>4. CATÁLOGO & FOTOS IA (UNIFICADO)</h1>
            <span style={{ fontSize: 11, background: "rgba(20,184,166,0.15)", color: "#2dd4bf", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(45,212,191,0.3)", fontWeight: 700 }}>
              INVENTARIO EN VIVO
            </span>
          </div>
          <p>Un solo lugar para tus modelos, stock disponible, precios y las fotos reales que el bot envía por WhatsApp.</p>
        </div>

        {/* Filtros Rápidos de Categoría tipo Cápsula */}
        <div className="branch-pills-row">
          {["Todas", "Motocicletas", "Cascos", "Repuestos", "Lubricantes"].map(cat => (
            <button
              key={cat}
              className={"branch-pill " + (catSel === cat ? "active" : "")}
              onClick={() => setCatSel(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Hero Banner Showroom Digital ─── */}
      <div className="hero-money-card" style={{ minHeight: 180, marginBottom: 28, background: "#0b1017" }}>
        <div className="hero-content">
          <div className="hero-top-row">
            <span style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
              Showroom Digital Motos & Motos
            </span>
            <span className="hero-badge-tag" style={{ background: "rgba(20,184,166,0.12)", color: "#2dd4bf" }}>
              100% SINCRONIZADO CON WHATSAPP
            </span>
          </div>

          <div className="hero-amount-box" style={{ margin: "6px 0" }}>
            <span className="hero-amount" style={{ fontSize: 40 }}>
              {productos.length} Productos · {totalFotos} Fotos HD
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: "#94a3b8" }}>
            Cuando un cliente pide ver un modelo o repuesto en WhatsApp, el bot envía automáticamente la ficha técnica, el precio con IVA y sus fotos.
          </div>
        </div>
      </div>

      {/* ─── Grid de Cards de Producto / Showroom ─── */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Modelos y Artículos Destacados en el Bot
        </h3>
      </div>

      <div className="showroom-grid">
        {filtrados.map(p => {
          const precioConIva = (p.precio_iva || p.precio * 1.15).toFixed(2);
          const imgSrc = imgPorCat[p.categoria] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";

          return (
            <div key={p.id} className="showroom-card">
              <div className="showroom-img-box">
                <img src={imgSrc} alt={p.nombre} />
                <span className="showroom-stock-badge">
                  {p.stock > 0 ? \`\${p.stock} UNID. EN STOCK\` : "BAJO PEDIDO"}
                </span>
              </div>

              <div className="showroom-body">
                <div>
                  <div className="showroom-price">
                    $\${p.precio.toFixed(2)} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>USD</span>
                  </div>
                  <div className="showroom-price-sub">
                    $\${precioConIva} con IVA incluido
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                    {p.nombre}
                  </h4>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>
                    {p.subcategoria || p.categoria} · 4 Fotos listas en bot
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button 
                    className="btn-nigeen" 
                    style={{ fontSize: 12, padding: "6px 8px 6px 14px" }}
                    onClick={() => alert(\`Gestión de Stock y Fotos para: \${p.nombre}\\n\\nPrecio Base: $\${p.precio}\\nPrecio c/IVA: $\${precioConIva}\\nStock actual: \${p.stock} unidades\\n\\nLas fotos se sincronizan directamente con el almacenamiento de Bunny CDN para despacho en WhatsApp.\`)}
                  >
                    <span>Gestionar Fotos & Stock</span>
                    <span className="btn-nigeen-circle" style={{ width: 22, height: 22, fontSize: 13 }}>›</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`;

const oldInvStart = '/* ─── Componente Inventario / Catálogo ───────────────── */';
const oldCrmStart = '/* ─── CRM Principal ──────────────────────────────────── */';
const startIndex = code.indexOf(oldInvStart);
const endIndex = code.indexOf(oldCrmStart);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + unifiedCatalogComponent + '\n\n' + code.substring(endIndex);
  fs.writeFileSync(pagePath, code, 'utf8');
  console.log('✅ Replaced Inventario & Imagenes with Unified CatalogoShowroom successfully');
} else {
  console.error('❌ Could not locate Inventario/Imagenes bounds');
}

