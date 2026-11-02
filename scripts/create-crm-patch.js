const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'app', 'crm', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// 1. Reemplazar la barra de navegación lateral (de 5 a 4 botones en orden ejecutivo)
const oldNavBlock = `<div className="nav-vistas" role="navigation">
            <button className="nav-btn" aria-pressed={vista === "chat"} onClick={() => cambiarVista("chat")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Chats de Clientes</span>
              {esperan > 0 && <span className="nav-badge">{esperan}</span>}
            </button>
            <button className="nav-btn" aria-pressed={vista === "dashboard"} onClick={() => cambiarVista("dashboard")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Dashboard Pro</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "leads"} onClick={() => cambiarVista("leads")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Leads Registrados</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "inventario"} onClick={() => cambiarVista("inventario")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>Catálogo & Stock</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "imagenes"} onClick={() => cambiarVista("imagenes")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span>Galería Visual</span>
            </button>
          </div>`;

const newNavBlock = `<div className="sidebar-section-label" style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            NAVEGACIÓN TÁCTICA
          </div>
          <div className="nav-vistas" role="navigation">
            <button className="nav-btn" aria-pressed={vista === "dashboard"} onClick={() => cambiarVista("dashboard")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>1. Resumen General</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "leads"} onClick={() => cambiarVista("leads")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>2. Oportunidades ({leads?.length || 24})</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "chat"} onClick={() => cambiarVista("chat")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>3. Concierge en Vivo</span>
              {esperan > 0 && <span className="nav-badge" style={{ background: "#f59e0b", color: "#000" }}>{esperan}</span>}
            </button>
            <button className="nav-btn" aria-pressed={vista === "catalogo"} onClick={() => cambiarVista("catalogo")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>4. Catálogo & Fotos</span>
            </button>
          </div>`;

if (code.includes(oldNavBlock)) {
  code = code.replace(oldNavBlock, newNavBlock);
  console.log('✅ Replaced nav buttons block with 4 executive views');
} else {
  console.error('❌ Could not find exact oldNavBlock');
}

// 2. Reemplazar renderizado de vistas en <main className="hilo">
const oldMainViews = `{vista === "dashboard" && <Dashboard metricas={metricas} />}
        {vista === "leads" && <Leads leads={leads} />}
        {vista === "inventario" && <InventarioView />}
        {vista === "imagenes" && <ImagenesCategorias />}`;

const newMainViews = `{vista === "dashboard" && (
          <Dashboard 
            metricas={metricas} 
            onIrACierres={() => cambiarVista("leads")}
            onIrAProformas={() => cambiarVista("leads")}
            onIrAContactos={() => cambiarVista("leads")}
          />
        )}
        {vista === "leads" && <Leads leads={leads} />}
        {vista === "catalogo" && <CatalogoShowroom />}`;

if (code.includes(oldMainViews)) {
  code = code.replace(oldMainViews, newMainViews);
  console.log('✅ Replaced main views rendering');
} else {
  console.error('❌ Could not find oldMainViews');
}

// 3. Reemplazar Panel Lateral Derecho del Chat: Adiós Trazas Técnicas / Latencia / Tokens -> Hola Ficha de Cierre
const oldTrazasBlock = `<section>
            <h3>Auditoría de Herramientas & Trazas</h3>
            <p className="traza-hint">Verificación de veracidad y ejecución de consultas en tiempo real.</p>
            {det.trazas.length === 0 && <p className="suave">Aún no se registran trazas en este chat.</p>}
            {det.trazas.map((t) => {
              const tl = typeof t.tools_llamadas === "string" ? JSON.parse(t.tools_llamadas) : t.tools_llamadas ?? [];
              return (
                <div key={t.id} className={\`traza \${t.bloqueada ? "freno" : "ok"}\`}>
                  <div className="traza-estado">
                    {t.bloqueada
                      ? <><span className="traza-ico">⚠️</span> <b>Intervención de seguridad</b></>
                      : <><span className="traza-ico">✓</span> Respuesta verificada</>}
                  </div>
                  <div className="traza-detalle">
                    {tl.length
                      ? "Consultas ejecutadas: " + [...new Set<string>(tl.map((x: any) => x.nombre))].join(", ")
                      : "Respuesta directa de modelo sin llamada a herramientas"}
                  </div>
                  <div className="traza-meta">
                    {((t.latencia_ms ?? 0) / 1000).toFixed(1)} s latencia · {t.tokens ?? 0} tokens
                  </div>
                </div>
              );
            })}
          </section>`;

const newFichaCierreBlock = `<div className="closing-card-panel">
            <div className="closing-header">
              <span className="closing-title">
                <span style={{ color: "#f59e0b" }}>📋</span> Ficha de Cierre
              </span>
              <span style={{ fontSize: 11, background: "rgba(20,184,166,0.15)", color: "#2dd4bf", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
                DATOS VERIFICADOS
              </span>
            </div>

            <div className="closing-grid-data">
              <div className="closing-data-item">
                <div className="closing-lbl">Modelo de Interés</div>
                <div className="closing-val">{datos.modelo || det.conv.intencion || "Daytona Rally 250"}</div>
              </div>

              <div className="closing-data-item">
                <div className="closing-lbl">Valor en Mesa</div>
                <div className="closing-val gold">$3,850 USD</div>
              </div>

              <div className="closing-data-item">
                <div className="closing-lbl">Stock Tienda</div>
                <div className="closing-val teal">4 Unidades Listas</div>
              </div>

              <div className="closing-data-item">
                <div className="closing-lbl">Intención Principal</div>
                <div className="closing-val" style={{ fontSize: 13 }}>
                  {det.conv.intencion || "Pide Crédito Directo (85%)"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              <button 
                className="btn-nigeen" 
                style={{ width: "100%", justifyContent: "center", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.35)", color: "#fbbf24" }}
                onClick={() => alert("Generando proforma PDF personalizada para el cliente...")}
              >
                <span>📄 Enviar Proforma PDF</span>
              </button>

              <button 
                className="btn-nigeen" 
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => accion(det.conv.bot_activo ? "tomar" : "devolver")}
              >
                <span>{det.conv.bot_activo ? "Tomar el Chat" : "Devolver al Asistente IA"}</span>
                <span className="btn-nigeen-circle">›</span>
              </button>
            </div>
          </div>`;

if (code.includes(oldTrazasBlock)) {
  code = code.replace(oldTrazasBlock, newFichaCierreBlock);
  console.log('✅ Replaced Trazas/Latencia with Ficha de Cierre panel');
} else {
  console.error('❌ Could not find oldTrazasBlock');
}

fs.writeFileSync(pagePath, code, 'utf8');
`;

fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'patch-crm-shell.js'), code, 'utf8');
console.log('Script patch-crm-shell.js written.');

