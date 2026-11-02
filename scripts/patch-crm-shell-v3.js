/**
 * patch-crm-shell-v3.js — usa indexOf con strings únicas cortas para localizar y reemplazar bloques
 */
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "app", "crm", "page.tsx");
let src = fs.readFileSync(filePath, "utf8");

// Normalizar a LF para operar, luego devolver con CRLF si el archivo original era CRLF
const hasCRLF = src.includes("\r\n");
if (hasCRLF) src = src.replace(/\r\n/g, "\n");

// ─── A. useState vista: ya parchado en v1 — verificar ─────────────────────────
if (src.includes('"inventario" || v === "imagenes"')) {
  src = src.replace(
    'if (v === "chat" || v === "dashboard" || v === "leads" || v === "inventario" || v === "imagenes") return v;',
    'if (v === "chat" || v === "dashboard" || v === "leads" || v === "catalogo") return v;'
  );
  console.log("[A] useState Vista parchado");
} else {
  console.log("[A] useState Vista ya estaba parchado");
}

// ─── B. Marca badge ya parchado en v1 — verificar ────────────────────────────
if (src.includes('<span className="marca-badge">R</span>')) {
  src = src.replace(
    '<span className="marca-badge">R</span>',
    '<span className="marca-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", boxShadow: "0 0 15px rgba(245,158,11,0.35)" }}>M</span>'
  );
  console.log("[B] Marca badge parchada");
} else {
  console.log("[B] Marca badge ya estaba parchada");
}

// ─── C. Navegación lateral ────────────────────────────────────────────────────
// Usar un marcador único: la apertura del nav-vistas hasta el cierre </div> antes del {vista === "chat" &&
const navMarkerStart = '{/* Navegación principal */}';
const navMarkerEnd = '          </div>\n\n          {vista === "chat" && (';

const navS = src.indexOf(navMarkerStart);
const navE = src.indexOf(navMarkerEnd, navS);

if (navS === -1) { console.error("[C] No se encontró marcador inicio nav"); process.exit(1); }
if (navE === -1) { console.error("[C] No se encontró marcador fin nav"); process.exit(1); }

const navNewContent = `{/* Navegación principal */}
          <div className="sidebar-section-label" style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            NAVEGACIÓN TÁCTICA
          </div>
          <div className="nav-vistas" role="navigation">
            <button className="nav-btn" aria-pressed={vista === "dashboard"} onClick={() => cambiarVista("dashboard")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>1. Resumen General</span>
            </button>
            <button className="nav-btn" aria-pressed={vista === "leads"} onClick={() => cambiarVista("leads")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>2. Oportunidades ({leads?.length ?? 0})</span>
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

src = src.substring(0, navS) + navNewContent + "\n\n          " + src.substring(navE + '          </div>\n\n          '.length);
console.log("[C] Navegación lateral 5→4 botones OK");

// ─── D. Renderizado de vistas ─────────────────────────────────────────────────
// D1: dashboard con callbacks
if (src.includes('{vista === "dashboard" && <Dashboard metricas={metricas} />}')) {
  src = src.replace(
    '{vista === "dashboard" && <Dashboard metricas={metricas} />}',
    `{vista === "dashboard" && (
          <Dashboard
            metricas={metricas}
            onIrACierres={() => cambiarVista("leads")}
            onIrAProformas={() => cambiarVista("leads")}
            onIrAContactos={() => cambiarVista("leads")}
          />
        )}`
  );
  console.log("[D1] Dashboard callbacks OK");
} else {
  console.log("[D1] Dashboard callbacks ya estaban o no encontrado");
}

// D2: inventario -> catalogo
if (src.includes('{vista === "inventario" && <InventarioView />}')) {
  src = src.replace(
    '{vista === "inventario" && <InventarioView />}',
    '{vista === "catalogo" && <CatalogoShowroom />}'
  );
  console.log("[D2] inventario → catalogo OK");
} else {
  console.log("[D2] No se encontró inventario (puede ya estar parchado)");
}

// D3: eliminar imagenes
if (src.includes('{vista === "imagenes" && <ImagenesCategorias />}')) {
  src = src.replace('\n        {vista === "imagenes" && <ImagenesCategorias />}', '');
  console.log("[D3] imagenes eliminado OK");
} else {
  console.log("[D3] imagenes no encontrado (puede ya estar eliminado)");
}

// ─── E. Ficha de Cierre: reemplazar bloque Auditoria ─────────────────────────
const auditoriaMarker = '<h3>Auditoría de Herramientas & Trazas</h3>';
const auditoriaIdx = src.indexOf(auditoriaMarker);

if (auditoriaIdx !== -1) {
  // Encontrar el <section> que lo contiene (buscando hacia atrás)
  const sectionOpen = '<section>';
  let sectionStart = src.lastIndexOf(sectionOpen, auditoriaIdx);
  // Encontrar el </section> de cierre (buscando hacia adelante)
  const sectionClose = '</section>';
  let sectionEnd = src.indexOf(sectionClose, auditoriaIdx) + sectionClose.length;

  const fichaNew = `<section className="closing-card-panel">
            <div className="closing-header">
              <span className="closing-title">Ficha de Cierre</span>
              <span style={{ fontSize: 11, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.05em" }}>EN VIVO</span>
            </div>
            <div className="closing-grid-data">
              <div className="closing-data-item">
                <span className="closing-lbl">Modelo de Interés</span>
                <span className="closing-val">{datos?.modelo || det.conv.intencion || "—"}</span>
              </div>
              <div className="closing-data-item">
                <span className="closing-lbl">Valor en Mesa</span>
                <span className="closing-val" style={{ color: "#f59e0b", fontWeight: 700 }}>
                  {datos?.precio_cotizado ? "$" + Number(datos.precio_cotizado).toLocaleString("es-EC") + " USD" : "Por cotizar"}
                </span>
              </div>
              <div className="closing-data-item">
                <span className="closing-lbl">Stock Disponible</span>
                <span className="closing-val">{datos?.stock_confirmado || "Consultar tienda"}</span>
              </div>
              <div className="closing-data-item">
                <span className="closing-lbl">Intención Principal</span>
                <span className="closing-val">{det.conv.intencion || "—"}</span>
              </div>
              <div className="closing-data-item">
                <span className="closing-lbl">Estado Bot</span>
                <span className="closing-val" style={{ color: det.conv.bot_activo ? "#14b8a6" : "#f59e0b" }}>
                  {det.conv.bot_activo ? "IA Activa" : "Asesor al mando"}
                </span>
              </div>
              <div className="closing-data-item">
                <span className="closing-lbl">Respuestas IA</span>
                <span className="closing-val">{det.mensajes.filter(m => m.rol === "bot").length} generadas</span>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-nigeen gold" style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Enviar Proforma PDF</span>
                <span className="btn-nigeen-circle">›</span>
              </button>
              <button
                className="btn-nigeen"
                style={{ width: "100%", justifyContent: "space-between", background: det.conv.bot_activo ? "rgba(245,158,11,0.08)" : "rgba(20,184,166,0.08)", borderColor: det.conv.bot_activo ? "#f59e0b" : "#14b8a6" }}
                onClick={async () => {
                  await fetch("/api/crm/conversaciones/" + det.conv.id + "/estado", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bot_activo: det.conv.bot_activo ? 0 : 1 }),
                  });
                  cargarDetalle(det.conv.id);
                }}
              >
                <span>{det.conv.bot_activo ? "Tomar el Chat" : "Devolver al Asistente IA"}</span>
                <span className="btn-nigeen-circle">›</span>
              </button>
            </div>
          </section>`;

  src = src.substring(0, sectionStart) + fichaNew + src.substring(sectionEnd);
  console.log("[E] Auditoria → Ficha de Cierre OK");
} else {
  console.log("[E] No se encontró marcador de Auditoria (puede ya estar parchado)");
}

// ─── Restaurar CRLF y guardar ────────────────────────────────────────────────
if (hasCRLF) src = src.replace(/\n/g, "\r\n");
fs.writeFileSync(filePath, src, "utf8");
console.log("\n✅ patch-crm-shell-v3.js completado. Archivo guardado.");

