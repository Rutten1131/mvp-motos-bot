const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Tipografía Global y Estilo Editorial High-Ticket
const typographyAdditions = `
/* ─── High-Ticket Typography & Font Pairing (Maven Pro + Libre Baskerville) ─── */
h1, h2, h3, h4, .dash-main-title, .exec-title-box h1, .hero-amount, .closing-title, .deal-val, .showroom-price {
  font-family: var(--font-family);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.dash-subtitle, .exec-title-box p, .hero-amount-sub, .deal-model, .qa-sub {
  font-family: var(--font-serif);
  font-style: italic;
  letter-spacing: 0.01em;
}

/* ─── Eliminación Total de Fondos Blancos (Global Obsidian Polish) ─── */
.hilo {
  background: var(--system-bg) !important;
}

.mensajes {
  background: var(--system-bg) !important;
}

.caja textarea {
  background: var(--system-bg-secondary) !important;
  color: var(--label-primary) !important;
  border-color: var(--separator) !important;
}

.caja textarea:focus {
  border-color: var(--accent-teal) !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.25) !important;
}

.buscador-chats:focus-within {
  background: var(--system-bg-tertiary) !important;
  border-color: var(--accent-teal) !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.25) !important;
}

.seg-btn[aria-pressed="true"] {
  background: rgba(20, 184, 166, 0.2) !important;
  color: #2dd4bf !important;
  border: 1px solid rgba(20, 184, 166, 0.4) !important;
}

.btn-prueba {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid var(--separator) !important;
  color: #94a3b8 !important;
}

.btn-prueba:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: var(--accent-teal) !important;
  color: #f8fafc !important;
  box-shadow: none !important;
}

.bienvenida {
  background: var(--system-bg-secondary) !important;
  border-color: var(--separator) !important;
  color: var(--label-secondary) !important;
}

.traza {
  background: var(--system-bg-secondary) !important;
  border-color: var(--separator) !important;
  color: var(--label-primary) !important;
}

.ficha {
  background: var(--sidebar-material) !important;
  border-left-color: var(--separator) !important;
}

.ficha section {
  border-bottom-color: var(--separator) !important;
}

.ficha h3 {
  color: var(--label-primary) !important;
}

.datos-lista li {
  border-bottom-color: var(--separator-subtle) !important;
}

.dato-key {
  color: var(--label-tertiary) !important;
}

/* Scrollbar dark mode */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.22);
}
`;

css += '\n' + typographyAdditions;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS_OVERHAUL_APPLIED');

