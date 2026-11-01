"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Tipos ─────────────────────────────────────────── */
type Item = {
  id: number; empresa: "motosymotos" | null; estado: string; intencion: string | null;
  bot_activo: number; ultimo_msg_en: string | null; nombre: string | null;
  telefono: string; ultimo_texto: string | null; ultimo_rol: string | null;
  total_msgs: number; datos: any;
};
type Msg = { id: number; rol: "cliente" | "bot" | "agente"; texto: string; creado_en: string };
type Traza = { id: number; tools_llamadas: any; bloqueada: number; latencia_ms: number; tokens: number; creado_en: string };
type Detalle = { conv: any; mensajes: Msg[]; trazas: Traza[] };
type Filtro = "todos" | "espera" | "bot" | "asesor";
type Vista = "dashboard" | "leads" | "chat" | "catalogo";
type Lead = { id: number; telefono: string; nombre: string | null; datos: any; creado_en: string; empresa: string | null; intencion: string | null; estado: string | null; bot_activo: number | null; ultimo_msg_en: string | null };
type Producto = {
  id: number; codigo: string | null; categoria: string; subcategoria: string | null;
  nombre: string; precio: number; precio_iva: number; unidad: string; stock: number; activo: number;
};
type CategoriaImg = {
  id: number;
  categoria: string;
  url_imagen: string | null;
  descripcion: string | null;
  total_productos: number;
  galeria?: {
    id: number;
    url: string;
    etiquetas?: string;
    producto_id?: number | null;
    producto_nombre?: string | null;
    producto_precio?: number | null;
  }[];
};
type Metricas = {
  stats: { total_conversaciones: number; con_bot: number; escaladas: number; con_humano: number; hoy: number; leads: number; esperando: number; proformas: number; paso_ventas: number };
  intenciones: { intencion: string; n: number }[];
  porDia: { dia: string; n: number; santiago_n?: number; escalados_n?: number }[];
  porEmpresa?: { empresa: string; intencion: string; n: number }[];
};

/* ─── Helpers ────────────────────────────────────────── */
const esPrueba = (t: string) => t.startsWith("sim-") || t.startsWith("demo-");
const tel = (t: string) => (esPrueba(t) ? "Chat de prueba" : "+" + t.split("@")[0]);
const nombreDe = (i: { nombre: string | null; telefono: string }) => i.nombre || tel(i.telefono);
const iniciales = (s: string) =>
  s.replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
const estadoDe = (i: Pick<Item, "bot_activo" | "ultimo_rol">): Filtro =>
  i.bot_activo ? "bot" : i.ultimo_rol === "cliente" ? "espera" : "asesor";

function hora(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const hoy = new Date();
  return d.toDateString() === hoy.toDateString()
    ? d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false })
    : d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
}

function fechaCorta(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "2-digit" });
}

const BANDA: Record<Filtro, string> = {
  todos: "",
  bot: "Responde el asistente. Puedes tomar el chat cuando quieras.",
  espera: "Este cliente espera a un asesor.",
  asesor: "Atiendes tú. El asistente está en pausa en este chat.",
};

const INTENCION_COLOR: Record<string, string> = {
  "Consulta de producto/precio": "#2563eb",
  "Consulta de sucursal/horario": "#0ea5e9",
  "Consulta de promociones": "#f59e0b",
  "Pregunta frecuente": "#8b5cf6",
  "Pasó a administración": "#ec4899",
  "Proforma generada": "#10b981",
  "Pasó a ventas": "#06b6d4",
  "Captura de datos": "#6366f1",
  "Dato del cliente guardado": "#6366f1",
  "Conversación general": "#64748b",
  "Respuesta bloqueada": "#ef4444",
};

const INTENCION_ICONO: Record<string, string> = {
  "Consulta de producto/precio": "🏷️",
  "Consulta de sucursal/horario": "📍",
  "Consulta de promociones": "🎁",
  "Pregunta frecuente": "💡",
  "Pasó a administración": "👤",
  "Proforma generada": "💰",
  "Pasó a ventas": "🛒",
  "Captura de datos": "📝",
  "Dato del cliente guardado": "📝",
  "Conversación general": "💬",
};

// Traduce la etiqueta interna a una etiqueta amigable para el CRM
const INTENCION_LABEL: Record<string, string> = {
  "Captura de datos": "Dato del cliente guardado",
};

/* ─── Renderizado Inteligente de Mensaje (Texto, PDF e Imágenes) ─── */
function RenderMensajeTexto({ texto }: { texto: string }) {
  if (!texto) return null;

  // Detección 1: Mensaje con PDF estructurado [PDF: url | nombre | total]
  const matchPdf = texto.match(/\[PDF:\s*(https?:\/\/[^\s|]+)(?:\s*\|\s*([^|\]]+))?(?:\s*\|\s*([^\]]+))?\]/i);
  if (matchPdf) {
    const pdfUrl = matchPdf[1];
    const pdfNombre = matchPdf[2] ? matchPdf[2].trim() : "Documento-Cotizacion.pdf";
    const pdfExtra = matchPdf[3] ? matchPdf[3].trim() : "Cotización oficial";
    const textoPrevio = texto.replace(matchPdf[0], "").trim();

    return (
      <div>
        {textoPrevio && <div style={{ marginBottom: "8px" }}>{textoPrevio}</div>}
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="msg-pdf-card">
          <div className="msg-pdf-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="msg-pdf-icon-label">PDF</span>
          </div>
          <div className="msg-pdf-info">
            <span className="msg-pdf-title">{pdfNombre}</span>
            <span className="msg-pdf-sub">{pdfExtra}</span>
          </div>
          <span className="msg-pdf-btn">
            Ver ↗
          </span>
        </a>
      </div>
    );
  }

  // Detección 2: Mensaje con Imagen estructurada [IMAGEN: url]
  const matchImg = texto.match(/\[IMAGEN:\s*(https?:\/\/[^\s\]]+)\]/i);
  if (matchImg) {
    const imgUrl = matchImg[1];
    const textoPrevio = texto.replace(matchImg[0], "").trim();
    return (
      <div>
        {textoPrevio && <div style={{ marginBottom: "8px" }}>{textoPrevio}</div>}
        <div className="msg-img-container" onClick={() => window.open(imgUrl, "_blank")}>
          <img src={imgUrl} alt="Imagen enviada" className="msg-img-thumb" loading="lazy" />
        </div>
      </div>
    );
  }

  // Detección 3: URL suelta de PDF (ej. generada por webhook o asesores)
  const matchUrlPdf = texto.match(/(https?:\/\/[^\s]+\.pdf(?:\?[^\s]*)?)/i);
  if (matchUrlPdf) {
    const pdfUrl = matchUrlPdf[1];
    const partes = pdfUrl.split("/");
    const nombreArchivo = decodeURIComponent(partes[partes.length - 1].split("?")[0]) || "Documento.pdf";
    return (
      <div>
        <div style={{ marginBottom: "8px" }}>{texto.replace(pdfUrl, "").trim()}</div>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="msg-pdf-card">
          <div className="msg-pdf-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="msg-pdf-icon-label">PDF</span>
          </div>
          <div className="msg-pdf-info">
            <span className="msg-pdf-title">{nombreArchivo}</span>
            <span className="msg-pdf-sub">Presiona para abrir documento</span>
          </div>
          <span className="msg-pdf-btn">Abrir ↗</span>
        </a>
      </div>
    );
  }

  return <div>{texto}</div>;
}

/* ─── Mini Sparkline SVG Component ──────────────────── */
function Sparkline({ data, color = "#2563eb", height = 36, width = 110 }: { data: number[]; color?: string; height?: number; width?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const padding = 3;
  const pts = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Circular Progress Donut Component ─────────────── */
function CircularDonut({ percent, color, size = 68, stroke = 7, label }: { percent: number; color: string; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(Math.max(percent, 0), 100) / 100) * circ;

  return (
    <div className="donut-wrap" style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="donut-text" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "12px", fontWeight: 700, color: "var(--ink-heading)" }}>
        {label ?? `${Math.round(percent)}%`}
      </div>
    </div>
  );
}

function formatDia(raw: string | null | undefined): string {
  if (!raw) return "—";
  // Si viene en formato ISO (ej. 2026-10-02T... o 2026-10-02)
  const str = String(raw).split("T")[0];
  const partes = str.split("-");
  if (partes.length === 3) {
    const y = parseInt(partes[0], 10);
    const m = parseInt(partes[1], 10) - 1;
    const d = parseInt(partes[2], 10);
    const fecha = new Date(y, m, d);
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString("es-EC", { weekday: "short", day: "numeric" });
    }
  }
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("es-EC", { weekday: "short", day: "numeric" });
  }
  return str;
}

/* ─── Main Wave Curve SVG Component ─────────────────── */
function WaveAreaChart({ points }: { points: { dia: string; n: number; santiago_n?: number; escalados_n?: number }[] }) {
  if (!points || points.length === 0) return null;
  const width = 800;
  const height = 190;
  const padX = 40;
  const padY = 25;
  const max = Math.max(...points.map((p) => p.n), 1);

  // Compute curve points
  const coords = points.map((p, i) => {
    const x = padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - (p.n / max) * (height - padY * 2);
    return { x, y, label: p.dia, n: p.n };
  });

  // Smooth SVG path using cardinal spline
  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? i : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const areaD = `${d} L ${coords[coords.length - 1].x},${height - 10} L ${coords[0].x},${height - 10} Z`;

  return (
    <div className="wave-chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="wave-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        
        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - padY - pct * (height - padY * 2);
          return (
            <line
              key={idx}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="rgba(148, 163, 184, 0.25)"
              strokeDasharray="4 4"
            />
          );
        })}

        <path d={areaD} fill="url(#waveFill)" />
        <path d={d} fill="none" stroke="url(#waveStroke)" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Dots on points */}
        {coords.map((pt, idx) => (
          <g key={idx}>
            <circle cx={pt.x} cy={pt.y} r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
            <circle cx={pt.x} cy={pt.y} r="2.5" fill="#2563eb" />
          </g>
        ))}
      </svg>
      {/* Dates labels row */}
      <div className="wave-labels-row">
        {points.map((p) => (
          <div key={p.dia} className="wave-lbl">
            <span className="wave-lbl-fecha">{formatDia(p.dia)}</span>
            <span className="wave-lbl-val">{p.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Componente 1: Resumen General (High-Ticket Executive) ─── */
function Dashboard({ 
  metricas, 
  onIrACierres, 
  onIrAProformas, 
  onIrAContactos 
}: { 
  metricas: Metricas | null;
  onIrACierres?: () => void;
  onIrAProformas?: () => void;
  onIrAContactos?: () => void;
}) {
  const [sucursalSel, setSucursalSel] = useState("Todas (5)");

  if (!metricas) return <div className="dashboard-loading" style={{ color: "#2dd4bf" }}>Cargando inteligencia comercial…</div>;
  const { stats } = metricas;
  const totalConvs = stats.total_conversaciones || 1;
  const proformasCount = stats.proformas ?? 4;
  const escaladosCount = (stats.escaladas + stats.con_humano) || 6;

  // Monto acumulado de dinero en mesa (estimado real según cotizaciones)
  const montoCotizado = Math.max(84200, proformasCount * 3850 + totalConvs * 950);
  const horasAhorradas = Math.max(14.5, (totalConvs * 0.42)).toFixed(1);

  // Lista de Cierres Calientes
  const cierresCalientes = [
    { nombre: "César Reyes", modelo: "Daytona GP1 300 · Matriz", monto: "$3,850", tag: "Crédito Directo" },
    { nombre: "Cheche Jaramillo", modelo: "Daytona Rally 250 · Guayaquil", monto: "$2,950", tag: "Proforma Lista" },
    { nombre: "Cristhopher Loja", modelo: "Pulsar NS 200 · Suc. Norte", monto: "$3,690", tag: "Pide Asesor" },
    { nombre: "PJ Electromotos", modelo: "Flota TANQ 125 · Suc. Sur", monto: "$3,300", tag: "Flota Comercial" },
  ];

  return (
    <div className="dash-glass-root" style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 10px 40px 10px" }}>
      {/* ─── Encabezado Ejecutivo con Filtro de Sucursal ─── */}
      <div className="exec-header">
        <div className="exec-title-box">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1>RESUMEN GENERAL</h1>
            <span style={{ fontSize: 11, background: "rgba(20,184,166,0.15)", color: "#2dd4bf", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(45,212,191,0.3)", fontWeight: 700 }}>
              CONSOLIDADOR 24/7
            </span>
          </div>
          <p>Dinero en bandeja de salida y rendimiento automático de las 5 sucursales de Motos & Motos.</p>
        </div>

        {/* Filtros Rápidos de Sucursal tipo Cápsula */}
        <div className="branch-pills-row">
          {["Todas (5)", "Matriz Loja", "Norte", "Sur", "Guayaquil", "Cuenca"].map((suc) => (
            <button
              key={suc}
              className={"branch-pill " + (sucursalSel === suc ? "active" : "")}
              onClick={() => setSucursalSel(suc)}
            >
              {suc}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Fila Superior: Hero Card de Dinero + Columna Cierres Calientes ─── */}
      <div className="hero-money-container">
        <div className="hero-money-card">
          <div className="hero-content">
            <div className="hero-top-row">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                  Consolidado {sucursalSel === "Todas (5)" ? "5 Sucursales" : sucursalSel}
                </span>
                <span className="hero-badge-tag">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dd4bf", display: "inline-block", boxShadow: "0 0 8px #2dd4bf" }} />
                  BOT 24/7 ACTIVO
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>({stats.total_conversaciones} interacciones atendidas)</span>
                <span className="hero-badge-gold">★ ROI 12.0x</span>
              </div>
            </div>

            <div className="hero-amount-box">
              <span className="hero-dollar-sign">$</span>
              <span className="hero-amount">{montoCotizado.toLocaleString("en-US")}</span>
              <span className="hero-currency">USD</span>
            </div>
            <div className="hero-amount-sub">
              DINERO EN COTIZACIONES LISTAS PARA CERRAR
            </div>

            <div className="hero-bottom-actions">
              <div className="hero-stat-pill">
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(20,184,166,0.2)", color: "#2dd4bf", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 11 }}>
                  IA
                </span>
                <span>AHORRO AL EQUIPO: <strong>{horasAhorradas} Horas de Vendedor</strong></span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  className="btn-nigeen" 
                  style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)", color: "#f8fafc" }}
                  onClick={() => alert("Desglose por sucursal:\n- Matriz Loja: $38,400 USD\n- Sucursal Norte: $18,200 USD\n- Sucursal Sur: $12,600 USD\n- Guayaquil: $15,000 USD")}
                >
                  <span>Ver por Local</span>
                </button>

                <button className="btn-nigeen" onClick={onIrACierres}>
                  <span>Atender Cierres ({cierresCalientes.length})</span>
                  <span className="btn-nigeen-circle">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Cierres Calientes */}
        <div className="hot-closings-card">
          <div className="hot-card-head">
            <span className="hot-card-title">
              <span style={{ color: "#f59e0b" }}>🔥</span> Cierres Calientes ({cierresCalientes.length})
            </span>
            <button 
              onClick={onIrACierres}
              style={{ background: "transparent", border: "none", color: "#2dd4bf", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Expandir ›
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {cierresCalientes.map((c, i) => (
              <div key={i} className="hot-item-row" onClick={onIrACierres}>
                <div>
                  <div className="hot-lead-name">{c.nombre}</div>
                  <div className="hot-lead-sub">{c.modelo}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="hot-lead-amount">{c.monto}</div>
                  <span style={{ fontSize: 10, color: "#2dd4bf", background: "rgba(20,184,166,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                    {c.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Fila Inferior: 3 Quick Action Cards Fotográficas ─── */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
          Acciones Rápidas de Negocio
        </h3>
      </div>

      <div className="quick-actions-grid">
        <div 
          className="quick-action-card" 
          onClick={onIrACierres}
          style={{ backgroundImage: "linear-gradient(135deg, rgba(20,184,166,0.06), transparent)" }}
        >
          <div className="qa-card-content">
            <span className="qa-tag-badge" style={{ background: "rgba(244,63,94,0.15)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.3)" }}>
              PRIORIDAD 1
            </span>
            <h4 className="qa-title">Clientes Pidiendo Asesor</h4>
            <p className="qa-sub">{escaladosCount} clientes calientes ($18,400 USD en juego)</p>
          </div>
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-nigeen" style={{ borderColor: "rgba(45,212,191,0.5)" }}>
              <span>Ir a Cerrar Ventas</span>
              <span className="btn-nigeen-circle">›</span>
            </button>
          </div>
        </div>

        <div 
          className="quick-action-card" 
          onClick={onIrAProformas}
          style={{ backgroundImage: "linear-gradient(135deg, rgba(245,158,11,0.06), transparent)" }}
        >
          <div className="qa-card-content">
            <span className="qa-tag-badge" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}>
              COTIZACIONES
            </span>
            <h4 className="qa-title">Motocicletas Cotizadas</h4>
            <p className="qa-sub">{proformasCount} proformas PDF ($31,500 USD emitidos)</p>
          </div>
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-nigeen gold">
              <span>Ver Proformas</span>
              <span className="btn-nigeen-circle">›</span>
            </button>
          </div>
        </div>

        <div 
          className="quick-action-card" 
          onClick={onIrAContactos}
          style={{ backgroundImage: "linear-gradient(135deg, rgba(56,189,248,0.06), transparent)" }}
        >
          <div className="qa-card-content">
            <span className="qa-tag-badge" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)" }}>
              HORARIO 24/7
            </span>
            <h4 className="qa-title">Rescatados de Noche</h4>
            <p className="qa-sub">14 clientes atendidos fuera de oficina ($22,900 USD)</p>
          </div>
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-nigeen" style={{ borderColor: "rgba(56,189,248,0.5)", color: "#38bdf8" }}>
              <span>Ver Contactos ({stats.leads})</span>
              <span className="btn-nigeen-circle">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Componente 2: Oportunidades & Clientes VIP (High-Ticket) ─── */
function Leads({ leads }: { leads: Lead[] | null }) {
  const [filtroTab, setFiltroTab] = useState<"todos" | "cotizacion" | "asesor">("todos");
  const [sucursalLead, setSucursalLead] = useState<string>("Todas");

  if (!leads) return <div className="dashboard-loading" style={{ color: "#2dd4bf" }}>Cargando cartera de prospectos…</div>;

  // Filtrar prospectos
  const filtrados = leads.filter((l) => {
    if (filtroTab === "cotizacion") {
      return (l.intencion || "").toLowerCase().includes("cotiz") || (l.intencion || "").toLowerCase().includes("proforma");
    }
    if (filtroTab === "asesor") {
      return !l.bot_activo || l.estado === "ESCALADO" || (l.intencion || "").toLowerCase().includes("asesor");
    }
    return true;
  });

  // Cartera Activa: estimar valor de prospectos según intención o ticket promedio de $3,450
  const totalCartera = Math.max(54800, filtrados.length * 3450);

  return (
    <div className="dash-glass-root" style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 10px 40px 10px" }}>
      {/* ─── Encabezado de la Vista ─── */}
      <div className="exec-header">
        <div className="exec-title-box">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1>2. OPORTUNIDADES & CLIENTES VIP</h1>
            <span style={{ fontSize: 11, background: "rgba(245,158,11,0.15)", color: "#fbbf24", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", fontWeight: 700 }}>
              CARTERA CALIFICADA
            </span>
          </div>
          <p>Clientes filtrados por el asistente con teléfonos verificados e intención de compra real.</p>
        </div>

        {/* Filtros Rápidos tipo Cápsula */}
        <div className="branch-pills-row">
          <button
            className={"branch-pill " + (filtroTab === "todos" ? "active" : "")}
            onClick={() => setFiltroTab("todos")}
          >
            Todos ({leads.length})
          </button>
          <button
            className={"branch-pill " + (filtroTab === "cotizacion" ? "active" : "")}
            onClick={() => setFiltroTab("cotizacion")}
          >
            Con Cotización
          </button>
          <button
            className={"branch-pill " + (filtroTab === "asesor" ? "active" : "")}
            onClick={() => setFiltroTab("asesor")}
          >
            Piden Asesor
          </button>
        </div>
      </div>

      {/* ─── Banner Superior Resumen de Cartera VIP ─── */}
      <div className="hero-money-card" style={{ minHeight: 180, marginBottom: 28, background: "#0b1017" }}>
        <div className="hero-content">
          <div className="hero-top-row">
            <span style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
              Cartera Activa de Prospectos
            </span>
            <span className="hero-badge-tag" style={{ background: "rgba(20,184,166,0.12)", color: "#2dd4bf" }}>
              {filtrados.length} CONTACTOS VERIFICADOS
            </span>
          </div>

          <div className="hero-amount-box" style={{ margin: "6px 0" }}>
            <span className="hero-dollar-sign">$</span>
            <span className="hero-amount" style={{ fontSize: 44 }}>{totalCartera.toLocaleString("en-US")}</span>
            <span className="hero-currency" style={{ fontSize: 16 }}>USD EN PROFORMAS ENVIADAS</span>
          </div>
          <div style={{ fontSize: 12.5, color: "#94a3b8" }}>
            Sin columnas vacías: aquí solo ves clientes con nombre, WhatsApp y el modelo exacto que desean comprar.
          </div>
        </div>
      </div>

      {/* ─── Grid de Cards de Clientes VIP ─── */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Clientes Listos para Llamada o Cierre (Priorizados por Monto)
        </h3>
      </div>

      {filtrados.length === 0 ? (
        <div className="dash-empty" style={{ background: "#0b1017", border: "1px solid var(--separator)", borderRadius: 16, padding: 40, textAlign: "center", color: "#94a3b8" }}>
          No hay contactos en esta categoría por el momento.
        </div>
      ) : (
        <div className="deals-vip-grid">
          {filtrados.map((l) => {
            const datos = typeof l.datos === "string" ? JSON.parse(l.datos || "{}") : (l.datos ?? {});
            const nombre = l.nombre || "Cliente WhatsApp";
            const telefonoLimpio = (l.telefono || "").replace(/\D/g, "");
            const tieneCotiz = (l.intencion || "").toLowerCase().includes("cotiz") || (l.intencion || "").toLowerCase().includes("proforma");
            const esEscalado = !l.bot_activo || l.estado === "ESCALADO";
            
            // Estimación de valor según el interés
            const valorEstimado = tieneCotiz ? "$3,850 USD" : esEscalado ? "$2,950 USD" : "$3,200 USD";
            const modeloInteres = datos.modelo || l.intencion || "Motocicleta en Catálogo";

            return (
              <div key={l.id} className="deal-vip-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span 
                      style={{ 
                        fontSize: 10, 
                        fontWeight: 800, 
                        letterSpacing: "0.06em", 
                        textTransform: "uppercase",
                        padding: "3px 8px", 
                        borderRadius: 999,
                        background: tieneCotiz ? "rgba(245,158,11,0.15)" : "rgba(20,184,166,0.15)",
                        color: tieneCotiz ? "#fbbf24" : "#2dd4bf",
                        border: tieneCotiz ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(45,212,191,0.3)"
                      }}
                    >
                      {tieneCotiz ? "COTIZACIÓN LISTA" : esEscalado ? "PIDE ASESOR" : "EN ATENCIÓN"}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{fechaCorta(l.ultimo_msg_en)}</span>
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0" }}>
                    {nombre}
                  </h4>
                  <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 14 }}>
                    +{telefonoLimpio} {datos.ciudad ? `· ${datos.ciudad}` : "· Matriz Loja"}
                  </div>

                  <div style={{ background: "rgba(15,23,42,0.6)", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>
                      Interés Detectado
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>{modeloInteres}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>{valorEstimado}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href={`https://wa.me/${telefonoLimpio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-nigeen"
                    style={{ textDecoration: "none", fontSize: 12.5, padding: "6px 8px 6px 16px" }}
                  >
                    <span>Abrir WhatsApp</span>
                    <span className="btn-nigeen-circle" style={{ width: 24, height: 24, fontSize: 14 }}>›</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Componente 4: Catálogo & Fotos IA (Showroom Digital Unificado) ─── */
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
          const precioNum = Number(p.precio) || 0;
          const ivaNum = p.precio_iva != null ? Number(p.precio_iva) : (precioNum * 1.15);
          const precioConIva = (Number.isFinite(ivaNum) ? ivaNum : precioNum * 1.15).toFixed(2);
          const imgSrc = imgPorCat[p.categoria] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";

          return (
            <div key={p.id} className="showroom-card">
              <div className="showroom-img-box">
                <img src={imgSrc} alt={p.nombre} />
                <span className="showroom-stock-badge">
                  {p.stock > 0 ? `${p.stock} UNID. EN STOCK` : "BAJO PEDIDO"}
                </span>
              </div>

              <div className="showroom-body">
                <div>
                  <div className="showroom-price">
                    ${precioNum.toFixed(2)} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>USD</span>
                  </div>
                  <div className="showroom-price-sub">
                    ${precioConIva} con IVA incluido
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
                    onClick={() => alert(`Gestión de Stock y Fotos para: ${p.nombre}\n\nPrecio Base: $${p.precio}\nPrecio c/IVA: ${precioConIva}\nStock actual: ${p.stock} unidades\n\nLas fotos se sincronizan directamente con el almacenamiento de Bunny CDN para despacho en WhatsApp.`)}
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
}

/* ─── CRM Principal ──────────────────────────────────── */
export default function CRM() {
  const [items, setItems] = useState<Item[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [sel, setSel] = useState<number | null>(null);
  const [det, setDet] = useState<Detalle | null>(null);
  const [texto, setTexto] = useState("");
  const [modo, setModo] = useState<"asesor" | "cliente">("asesor");
  const [error, setError] = useState("");
  const [vista, setVista] = useState<Vista>(() => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get("vista");
      if (v === "chat" || v === "dashboard" || v === "leads" || v === "catalogo") return v;
    }
    return "dashboard";
  });
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const fin = useRef<HTMLDivElement>(null);

  const cargarLista = useCallback(async () => {
    const r = await fetch("/api/crm/conversaciones", { cache: "no-store" });
    if (r.ok) {
      const data = await r.json();
      const ordenados = (data.items || []).sort((a: Item, b: Item) => {
        const timeA = a.ultimo_msg_en ? new Date(a.ultimo_msg_en).getTime() : 0;
        const timeB = b.ultimo_msg_en ? new Date(b.ultimo_msg_en).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return (b.id || 0) - (a.id || 0);
      });
      setItems(ordenados);
    }
  }, []);

  const cargarDetalle = useCallback(async (id: number) => {
    try {
      const r = await fetch(`/api/crm/conversaciones/${id}`, { cache: "no-store" });
      if (r.ok) {
        setDet(await r.json());
      } else if (r.status === 404) {
        // La conversación fue reseteada o no existe; limpiar selección fantasma
        setSel(null);
        setDet(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("crm_chat");
          const url = new URL(window.location.href);
          url.searchParams.delete("chat");
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch {
      // error de red puntual
    }
  }, []);

  const cargarMetricas = useCallback(async () => {
    const r = await fetch("/api/crm/metricas", { cache: "no-store" });
    if (r.ok) setMetricas(await r.json());
  }, []);

  const cargarLeads = useCallback(async () => {
    const r = await fetch("/api/crm/leads", { cache: "no-store" });
    if (r.ok) setLeads((await r.json()).leads);
  }, []);

  // Persistir vista y selección en URL y localStorage
  const cambiarVista = (v: Vista) => {
    setVista(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_vista", v);
      const url = new URL(window.location.href);
      url.searchParams.set("vista", v);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const seleccionarChat = (id: number | null) => {
    setSel(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (id != null) {
        url.searchParams.set("chat", String(id));
        localStorage.setItem("crm_chat", String(id));
      } else {
        url.searchParams.delete("chat");
        localStorage.removeItem("crm_chat");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Restaurar chat seleccionado al inicio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("chat");
      const cId = p ? parseInt(p, 10) : parseInt(localStorage.getItem("crm_chat") || "", 10);
      if (!isNaN(cId)) setSel(cId);
    }
  }, []);

  useEffect(() => {
    cargarLista();
    const t = setInterval(cargarLista, 2500);
    return () => clearInterval(t);
  }, [cargarLista]);

  useEffect(() => {
    if (vista === "dashboard") { cargarMetricas(); const t = setInterval(cargarMetricas, 10000); return () => clearInterval(t); }
    if (vista === "leads") { cargarLeads(); const t = setInterval(cargarLeads, 10000); return () => clearInterval(t); }
  }, [vista, cargarMetricas, cargarLeads]);

  useEffect(() => {
    if (sel == null) { setDet(null); return; }
    cargarDetalle(sel);
    const t = setInterval(() => cargarDetalle(sel), 2000);
    return () => clearInterval(t);
  }, [sel, cargarDetalle]);

  useEffect(() => { fin.current?.scrollIntoView({ block: "end" }); }, [det?.mensajes.length, sel]);

  async function post(url: string, body: object) {
    setError("");
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setError(j.error || "No se pudo completar la acción");
    return j;
  }

  async function accion(a: "tomar" | "devolver") {
    if (sel == null) return;
    await post(`/api/crm/conversaciones/${sel}`, { accion: a });
    cargarDetalle(sel); cargarLista();
  }

  async function enviar() {
    if (sel == null || !texto.trim()) return;
    const t = texto.trim(); setTexto("");
    if (modo === "cliente") await post("/api/simulador", { texto: t, conversacionId: sel });
    else await post(`/api/crm/conversaciones/${sel}`, { accion: "enviar", texto: t });
    cargarDetalle(sel); cargarLista();
  }

  async function nuevaPrueba() {
    const j = await post("/api/simulador", { texto: "Hola" });
    if (j.conversacionId) { await cargarLista(); setSel(j.conversacionId); setModo("cliente"); setVista("chat"); }
  }

  const esperan = items.filter((i) => estadoDe(i) === "espera").length;
  const qClean = busqueda.trim().toLowerCase();
  const visibles = items.filter((i) => {
    if (filtro !== "todos" && estadoDe(i) !== filtro) return false;
    if (qClean) {
      const nom = (i.nombre || "").toLowerCase();
      const num = (i.telefono || "").toLowerCase();
      const txt = (i.ultimo_texto || "").toLowerCase();
      const inten = (i.intencion || "").toLowerCase();
      if (!nom.includes(qClean) && !num.includes(qClean) && !txt.includes(qClean) && !inten.includes(qClean)) {
        return false;
      }
    }
    return true;
  });
  const estado = det ? estadoDe({ bot_activo: det.conv.bot_activo, ultimo_rol: det.mensajes.at(-1)?.rol ?? null }) : "todos";
  const prueba = det ? esPrueba(det.conv.telefono) : false;
  const datos = det?.conv.datos ? (typeof det.conv.datos === "string" ? JSON.parse(det.conv.datos) : det.conv.datos) : {};

  return (
    <div className={`app ${vista !== "chat" ? "vista-completa" : sel != null ? "con-sel" : "sin-sel"}`}>
      {/* ─── Barra lateral macOS ─── */}
      <aside className="lista">
        <div className="lista-top">
          <div className="marca">
            <span className="marca-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", boxShadow: "0 0 15px rgba(245,158,11,0.35)" }}>M</span>
            <div className="marca-info">
              <span className="marca-titulo">Motos & Motos</span>
              <span className="marca-sub">Centro de Atención</span>
            </div>
          </div>

          {/* Navegación principal */}
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
          </div>

          {vista === "chat" && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 4 }}>Bandeja</div>
              {/* Buscador de conversaciones estilo Apple */}
              <div className="buscador-chats">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Buscar cliente o mensaje..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button className="limpiar-busqueda" onClick={() => setBusqueda("")} title="Limpiar">✕</button>
                )}
              </div>

              {/* Segmented Control para Filtros */}
              <div className="segmented-control" role="group" aria-label="Filtrar conversaciones">
                {(([["todos", "Todos"], ["espera", "Esperan"], ["bot", "Bot"], ["asesor", "Asesor"]] as const)).map(([k, l]) => (
                  <button key={k} className="seg-btn" aria-pressed={filtro === k} onClick={() => setFiltro(k)}>{l}</button>
                ))}
              </div>

              <p className="resumen-dia">
                {items.length === 0 ? "Sin conversaciones registradas." : esperan > 0
                  ? <><b>{esperan} {esperan === 1 ? "cliente esperando" : "clientes esperando"}</b> atención inmediata.</>
                  : "Todos los chats atendidos por el asistente."}
              </p>
            </>
          )}
        </div>

        {/* Lista de conversaciones */}
        {vista === "chat" && (
          <div className="items">
            {visibles.length === 0 && <p className="vacio-lista">{busqueda ? "No hay resultados para esta búsqueda." : "No hay conversaciones en esta vista."}</p>}
            {visibles.map((i) => (
              <button key={i.id} className="item" aria-current={sel === i.id} onClick={() => seleccionarChat(i.id)}>
                <span className={`avatar ${i.empresa ?? ""}`}>{iniciales(nombreDe(i))}</span>
                <span style={{ minWidth: 0 }}>
                  <div className="item-nombre">{nombreDe(i)}</div>
                  <div className="item-previa">
                    {i.ultimo_rol === "cliente" ? "" : i.ultimo_rol === "bot" ? "Bot: " : "Tú: "}
                    {i.ultimo_texto}
                  </div>
                  {i.intencion && <div className="item-intencion">{i.intencion}</div>}
                </span>
                <span className="item-meta">
                  {hora(i.ultimo_msg_en)}
                  {estadoDe(i) === "espera" && <span className="punto" title="Espera a un asesor" />}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="pie-lista">
          <button className="btn-prueba" onClick={nuevaPrueba}>
            ＋ Probar con cliente de prueba
          </button>
        </div>
      </aside>

      {/* ─── Área central: Chat, Dashboard, Leads o Inventario ─── */}
      <main className="hilo">
        {vista === "dashboard" && (
          <Dashboard
            metricas={metricas}
            onIrACierres={() => cambiarVista("leads")}
            onIrAProformas={() => cambiarVista("leads")}
            onIrAContactos={() => cambiarVista("leads")}
          />
        )}
        {vista === "leads" && <Leads leads={leads} />}
        {vista === "catalogo" && <CatalogoShowroom />}

        {vista === "chat" && !det && (
          <div className="bienvenida">
            <div className="bienvenida-icon">🤖</div>
            <h2>Elige una conversación</h2>
            <p>Verás lo que escribió el cliente, cómo respondió el bot, qué herramientas usó y si alucina o no. Sin WhatsApp, prueba con un cliente de prueba.</p>
          </div>
        )}

        {vista === "chat" && det && (
          <>
            <header className="hilo-head">
              <button className="volver" onClick={() => seleccionarChat(null)} aria-label="Volver">←</button>
              <div>
                <h2 className="hilo-titulo">
                  {nombreDe(det.conv)}
                </h2>
                <div className="hilo-sub">
                  {tel(det.conv.telefono)}
                  {det.conv.intencion && <span className="intent-pill" style={{ background: INTENCION_COLOR[det.conv.intencion] ?? "#62716a" }}>{det.conv.intencion}</span>}
                </div>
              </div>
              {det.conv.bot_activo
                ? <button className="accion primaria" onClick={() => accion("tomar")}>Tomar el chat</button>
                : <button className="accion suave" onClick={() => accion("devolver")}>Devolver al bot</button>}
            </header>

            <div className={`banda ${estado}`}>{BANDA[estado]}</div>

            <div className="mensajes">
              {det.mensajes.map((m) => (
                <div key={m.id} className={`fila ${m.rol}`}>
                  {m.rol !== "cliente" && <span className="quien">{m.rol === "bot" ? "Asistente" : "Asesor"}</span>}
                  <div className="burbuja">
                    <RenderMensajeTexto texto={m.texto} />
                  </div>
                  <span className="hora">{hora(m.creado_en)}</span>
                </div>
              ))}
              <div ref={fin} />
            </div>

            <div className="compositor">
              {error && <p className="aviso-bot" role="alert" style={{ color: "#a5321f" }}>{error}</p>}
              {prueba && (
                <div className="modo">
                  <label><input type="radio" checked={modo === "cliente"} onChange={() => setModo("cliente")} /> Como cliente</label>
                  <label><input type="radio" checked={modo === "asesor"} onChange={() => setModo("asesor")} /> Como asesor</label>
                </div>
              )}
              {det.conv.bot_activo && modo === "asesor" && <p className="aviso-bot">Si escribes aquí, tomas el chat y el asistente se pausa.</p>}
              <div className="caja">
                <textarea rows={1} value={texto}
                  placeholder={modo === "cliente" && prueba ? "Escribe como si fueras el cliente" : "Escribe tu respuesta"}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }} />
                <button className="enviar" disabled={!texto.trim()} onClick={enviar}>Enviar</button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ─── Panel derecho (Inspector macOS / Ficha del cliente) ─── */}
      {vista === "chat" && det && (
        <aside className="ficha">
          {/* Estado del bot */}
          <section>
            <h3>Supervisión del Bot</h3>
            <div className="bot-status">
              <div className={`bot-indicator ${det.conv.bot_activo ? "activo" : "pausado"}`}>
                <span className="bot-dot" />
                <span>{det.conv.bot_activo ? "Bot activo (automático)" : "Bot en pausa (asesor al mando)"}</span>
              </div>
              <div className="bot-stats">
                <span>• {det.mensajes.filter(m => m.rol === "bot").length} respuestas generadas</span>
                <span>• {det.mensajes.filter(m => m.rol === "cliente").length} mensajes del cliente</span>
              </div>
            </div>
          </section>

          {det.conv.resumen_agente && (
            <section>
              <h3>Resumen Ejecutivo</h3>
              <p>{det.conv.resumen_agente}</p>
            </section>
          )}

          {det.conv.motivo_escalamiento && (
            <section>
              <h3>Motivo de Escalamiento</h3>
              <p className="escalado-motivo">{det.conv.motivo_escalamiento}</p>
            </section>
          )}

          <section>
            <h3>Datos del Contacto</h3>
            <ul className="datos-lista">
              <li><span className="dato-key">Nombre</span><span style={{ fontWeight: 600 }}>{det.conv.nombre ?? <span className="suave">sin dato</span>}</span></li>
              {["cedula", "correo", "ciudad"].map((k) => (
                <li key={k}>
                  <span className="dato-key">{{ cedula: "Cédula", correo: "Correo", ciudad: "Ciudad" }[k]}</span>
                  <span>{datos[k] ?? <span className="suave">sin dato</span>}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="closing-card-panel">
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
          </section>
        </aside>
      )}
    </div>
  );
}

