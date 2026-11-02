/**
 * patch-crm-shell-v2.js
 * Usa marcadores únicos para los reemplazos en lugar de bloques largos exactos
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "app", "crm", "page.tsx");
let src = fs.readFileSync(filePath, "utf8");

// ─── C. Navegación lateral ─────────────────────────────────────────────────────
// Marcador inicio: la línea del sidebar-section-label "Vistas"
// Marcador fin: </div> que cierra nav-vistas + línea vacía antes de {vista === "chat" &&
const navStart = '          {/* Navegación principal */}\n          <div className="sidebar-section-label">Vistas</div>\n          <div className="nav-vistas" role="navigation">';
const navEnd = '          </div>\n\n          {vista === "chat" && (';

const navStartIdx = src.indexOf(navStart);
const navEndIdx = src.indexOf(navEnd, navStartIdx);

if (navStartIdx === -1 || navEndIdx === -1) {
  console.error("[C] No se encontraron los marcadores de navegación. Start:", navStartIdx, "End:", navEndIdx);
  // Print a snippet around area
  const approx = src.indexOf('nav-vistas');
  console.log("Snippet alrededor de nav-vistas:\n", src.substring(approx - 100, approx + 500));
  process.exit(1);
}

const navNewBlock = `          {/* Navegación principal */}
          <div className="sidebar-section-label" style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            NAVEGACION TACTICA
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
              <span>4. Catalogo y Fotos</span>
            </button>`;

// Reemplazar desde navStart hasta el cierre </div> del nav-vistas
// El navEnd incluye el </div> cierre + "\n\n          {vista ===" que queremos conservar
src = src.substring(0, navStartIdx) + navNewBlock + "\n" + src.substring(navEndIdx);
console.log("[C] Navegacion lateral 5->4 botones ejecutivos OK");

// ─── D. Renderizado de vistas ─────────────────────────────────────────────────
const renderOld1 = '{vista === "inventario" && <InventarioView />}';
const renderOld2 = '{vista === "imagenes" && <ImagenesCategorias />}';
const renderDashOld = '{vista === "dashboard" && <Dashboard metricas={metricas} />}';

if (src.includes(renderDashOld)) {
  src = src.replace(renderDashOld,
    `{vista === "dashboard" && (
          <Dashboard
            metricas={metricas}
            onIrACierres={() => cambiarVista("leads")}
            onIrAProformas={() => cambiarVista("leads")}
            onIrAContactos={() => cambiarVista("leads")}
          />
        )}`
  );
  console.log("[D1] Dashboard con callbacks OK");
}

if (src.includes(renderOld1)) {
  src = src.replace(renderOld1, '{vista === "catalogo" && <CatalogoShowroom />}');
  console.log("[D2] inventario -> catalogo OK");
} else {
  console.log("[D2] renderOld1 no encontrado (puede ya estar parchado)");
}

if (src.includes(renderOld2)) {
  src = src.replace(renderOld2, '');
  console.log("[D3] imagenes eliminado OK");
} else {
  console.log("[D3] renderOld2 no encontrado (puede ya estar parchado)");
}

// ─── E. Ficha de Cierre: reemplazar sección Auditoria de Trazas ───────────────
const trazaMarker = '<h3>Auditor\u00eda de Herramientas & Trazas</h3>';
const trazaSectionStart = src.lastIndexOf('<section>', src.indexOf(trazaMarker));
const trazaSectionEnd = src.indexOf('</section>', src.indexOf(trazaMarker)) + '</section>'.length;

if (trazaSectionStart !== -1 && trazaSectionEnd > trazaSectionStart) {
  const fichaNew = `<section className="closing-card-panel">
            <div className="closing-header">
              <span className="closing-title">Ficha de Cierre</span>
              <span style={{ fontSize: 11, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.05em" }}>EN VIVO</span>
            </div>
            <div className="closing-grid-data">
              <div className="closing-data-item">
                <span className="closing-lbl">Modelo de Interes</span>
                <span className="closing-val">{datos?.modelo || det.conv.intencion || "\u2014"}</span>
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
                <span className="closing-lbl">Intencion Principal</span>
                <span className="closing-val">{det.conv.intencion || "\u2014"}</span>
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
                <span className="btn-nigeen-circle">&#8250;</span>
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
                <span className="btn-nigeen-circle">&#8250;</span>
              </button>
            </div>
          </section>`;

  src = src.substring(0, trazaSectionStart) + fichaNew + src.substring(trazaSectionEnd);
  console.log("[E] Auditoria de Trazas -> Ficha de Cierre OK");
} else {
  console.error("[E] No se encontro la seccion de Auditoria. Marker idx:", src.indexOf(trazaMarker));
}

// Guardar
fs.writeFileSync(filePath, src, "utf8");
console.log("\n OK patch-crm-shell-v2.js completado.");

