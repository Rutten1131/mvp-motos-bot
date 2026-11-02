/**
 * patch-crm-shell-final.js
 * Parcha el CRM Shell (export default function CRM) con:
 * A. useState Vista: validación de 4 vistas correctas
 * B. Marca badge M dorado
 * C. Navegación lateral: 4 botones en orden ejecutivo + label "NAVEGACIÓN TÁCTICA"
 * D. Renderizado de vistas: dashboard callbacks + catalogo (sin inventario/imagenes)
 * E. Panel derecho: reemplaza "Auditoría & Trazas" por "Ficha de Cierre"
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "app", "crm", "page.tsx");
let src = fs.readFileSync(filePath, "utf8");

// ─── A. useState Vista — validar 4 vistas correctas ───────────────────────────
src = src.replace(
  `if (v === "chat" || v === "dashboard" || v === "leads" || v === "inventario" || v === "imagenes") return v;`,
  `if (v === "chat" || v === "dashboard" || v === "leads" || v === "catalogo") return v;`
);
console.log("[A] useState Vista actualizado ✓");

// ─── B. Marca badge: R → M dorado ────────────────────────────────────────────
src = src.replace(
  `<span className="marca-badge">R</span>`,
  `<span className="marca-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", boxShadow: "0 0 15px rgba(245,158,11,0.35)" }}>M</span>`
);
console.log("[B] Marca badge M dorado ✓");

// ─── C. Navegación lateral: reemplazar 5 botones por 4 ejecutivos ─────────────
const navOld = `          {/* Navegación principal */}
          <div className="sidebar-section-label">Vistas</div>
          <div className="nav-vistas" role="navigation">
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

const navNew = `          {/* Navegación principal */}
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

if (src.includes(navOld)) {
  src = src.replace(navOld, navNew);
  console.log("[C] Navegación lateral 5→4 botones ejecutivos ✓");
} else {
  console.error("[C] ERROR: No se encontró el bloque de navegación exacto. Revisar el archivo.");
  process.exit(1);
}

// ─── D. Renderizado de vistas: catalogo en lugar de inventario/imagenes ────────
const renderOld = `        {vista === "dashboard" && <Dashboard metricas={metricas} />}
        {vista === "leads" && <Leads leads={leads} />}
        {vista === "inventario" && <InventarioView />}
        {vista === "imagenes" && <ImagenesCategorias />}`;

const renderNew = `        {vista === "dashboard" && (
          <Dashboard
            metricas={metricas}
            onIrACierres={() => cambiarVista("leads")}
            onIrAProformas={() => cambiarVista("leads")}
            onIrAContactos={() => cambiarVista("leads")}
          />
        )}
        {vista === "leads" && <Leads leads={leads} />}
        {vista === "catalogo" && <CatalogoShowroom />}`;

if (src.includes(renderOld)) {
  src = src.replace(renderOld, renderNew);
  console.log("[D] Renderizado de vistas actualizado (catalogo, sin inventario/imagenes) ✓");
} else {
  console.error("[D] ERROR: No se encontró el bloque de renderizado exacto.");
  process.exit(1);
}

// ─── E. Panel derecho: Reemplazar "Auditoría de Herramientas & Trazas" ────────
const trazaOld = `          <section>
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

const trazaNew = `          <section className="closing-card-panel">
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
                  const r = await fetch(\`/api/crm/conversaciones/\${det.conv.id}/estado\`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bot_activo: det.conv.bot_activo ? 0 : 1 }),
                  });
                  if (r.ok) cargarDetalle(det.conv.id);
                }}
              >
                <span>{det.conv.bot_activo ? "Tomar el Chat" : "Devolver al Asistente IA"}</span>
                <span className="btn-nigeen-circle">›</span>
              </button>
            </div>
          </section>`;

if (src.includes(trazaOld)) {
  src = src.replace(trazaOld, trazaNew);
  console.log("[E] Auditoría & Trazas → Ficha de Cierre ✓");
} else {
  console.error("[E] ERROR: No se encontró el bloque de Auditoría exacto.");
  // Guardar igualmente con los otros cambios
}

// Guardar
fs.writeFileSync(filePath, src, "utf8");
console.log("\n✅ patch-crm-shell-final.js completado. Archivo guardado.");

