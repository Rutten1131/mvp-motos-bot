const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

const highTicketComponentsCSS = `
/* ==========================================================================
   HIGH-TICKET EXECUTIVE COMPONENTS & NIGEEN LAKE BUTTONS
   ========================================================================== */

/* ─── Global Background & Ambient Glow ─────────────────── */
body {
  background-color: var(--system-bg) !important;
  color: var(--label-primary) !important;
  background-image: 
    radial-gradient(at 10% 15%, rgba(20, 184, 166, 0.05) 0px, transparent 450px),
    radial-gradient(at 90% 85%, rgba(245, 158, 11, 0.04) 0px, transparent 500px);
  background-attachment: fixed;
}

/* ─── Sidebar Executive Restyle ───────────────────────── */
.lista {
  background: var(--sidebar-material) !important;
  border-right: 1px solid var(--separator) !important;
}

.marca-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #000000 !important;
  font-weight: 800;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.35);
}

.nav-btn {
  color: var(--label-secondary) !important;
  border-radius: var(--radius-pill) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  color: var(--label-primary) !important;
}

.nav-btn[aria-pressed="true"] {
  background: rgba(20, 184, 166, 0.12) !important;
  color: #2dd4bf !important;
  border: 1px solid rgba(45, 212, 191, 0.3) !important;
  box-shadow: 0 0 20px rgba(45, 212, 191, 0.15) !important;
}

/* ─── Executive Header & Branch Filters ────────────────── */
.exec-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.exec-title-box h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--label-primary);
  margin: 0 0 6px 0;
}

.exec-title-box p {
  font-size: 13.5px;
  color: var(--label-tertiary);
  margin: 0;
}

.branch-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.6);
  padding: 4px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--separator);
  backdrop-filter: var(--glass-blur-subtle);
}

.branch-pill {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--label-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.branch-pill:hover {
  color: var(--label-primary);
}

.branch-pill.active {
  background: #f59e0b;
  color: #000000;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

/* ─── Hero Money Card ($84,200 USD) ────────────────────── */
.hero-money-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .hero-money-container {
    grid-template-columns: 1fr;
  }
}

.hero-money-card {
  position: relative;
  border-radius: var(--radius-xl);
  padding: 32px 36px;
  overflow: hidden;
  background: #0b1017;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 270px;
}

.hero-money-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center right;
  opacity: 0.16;
  filter: contrast(120%) grayscale(20%);
  z-index: 0;
}

.hero-money-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #0b1017 35%, rgba(11, 16, 23, 0.85) 70%, rgba(11, 16, 23, 0.4) 100%),
              linear-gradient(0deg, #0b1017 15%, transparent 60%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.hero-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  background: rgba(20, 184, 166, 0.12);
  border: 1px solid rgba(45, 212, 191, 0.35);
  color: #2dd4bf;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-badge-gold {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 700;
}

.hero-amount-box {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 12px 0 6px 0;
}

.hero-dollar-sign {
  font-size: 38px;
  font-weight: 300;
  color: #f8fafc;
}

.hero-amount {
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  font-feature-settings: "tnum";
}

.hero-currency {
  font-size: 20px;
  font-weight: 700;
  color: #2dd4bf;
  letter-spacing: 0.05em;
}

.hero-amount-sub {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--label-tertiary);
  margin-bottom: 24px;
}

.hero-bottom-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.hero-stat-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--label-secondary);
}

.hero-stat-pill strong {
  color: #ffffff;
}

/* ─── Nigeen Lake Capsule Button ───────────────────────── */
.btn-nigeen {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 8px 10px 8px 22px;
  border-radius: var(--radius-pill);
  background: rgba(20, 184, 166, 0.15);
  border: 1px solid rgba(45, 212, 191, 0.4);
  color: #2dd4bf;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.btn-nigeen:hover {
  background: rgba(20, 184, 166, 0.25);
  border-color: #2dd4bf;
  box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
  transform: translateY(-1px);
}

.btn-nigeen.gold {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.btn-nigeen.gold:hover {
  background: rgba(245, 158, 11, 0.25);
  border-color: #fbbf24;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.btn-nigeen-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  color: #06090e;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* ─── Cierres Calientes Card ───────────────────────────── */
.hot-closings-card {
  background: #0b1017;
  border: 1px solid var(--separator);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.hot-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.hot-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.hot-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-item-row:hover {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(245, 158, 11, 0.3);
  transform: translateX(3px);
}

.hot-lead-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.hot-lead-sub {
  font-size: 11.5px;
  color: var(--label-tertiary);
}

.hot-lead-amount {
  font-size: 15px;
  font-weight: 700;
  color: #f59e0b;
  font-feature-settings: "tnum";
}

/* ─── 3 Quick Action Cards (Fotográficas) ──────────────── */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

@media (max-width: 900px) {
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}

.quick-action-card {
  position: relative;
  border-radius: var(--radius-xl);
  padding: 24px 26px;
  overflow: hidden;
  background: #0b1017;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-card);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.quick-action-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
}

.quick-action-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  filter: grayscale(30%);
  z-index: 0;
  transition: opacity 0.3s ease;
}

.quick-action-card:hover::before {
  opacity: 0.25;
}

.quick-action-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, #0b1017 30%, rgba(11, 16, 23, 0.8) 70%, rgba(11, 16, 23, 0.4) 100%);
  z-index: 1;
}

.qa-card-content {
  position: relative;
  z-index: 2;
}

.qa-tag-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.qa-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.qa-sub {
  font-size: 12px;
  color: var(--label-secondary);
  margin: 0 0 18px 0;
}

/* ─── VIP Deals Grid ───────────────────────────────────── */
.deals-vip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.deal-vip-card {
  background: #0b1017;
  border: 1px solid var(--separator);
  border-radius: var(--radius-lg);
  padding: 22px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  box-shadow: var(--shadow-card);
  transition: all 0.25s ease;
}

.deal-vip-card:hover {
  border-color: rgba(245, 158, 11, 0.35);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
  transform: translateY(-2px);
}

.deal-vip-card::before {
  content: "";
  position: absolute;
  right: -20px;
  top: -20px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ─── Showroom Unified Cards ───────────────────────────── */
.showroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

.showroom-card {
  background: #0b1017;
  border: 1px solid var(--separator);
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.showroom-card:hover {
  border-color: rgba(45, 212, 191, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8);
}

.showroom-img-box {
  height: 170px;
  position: relative;
  background: #080d14;
  overflow: hidden;
}

.showroom-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.showroom-card:hover .showroom-img-box img {
  transform: scale(1.05);
}

.showroom-stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(6, 9, 14, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: #2dd4bf;
  font-size: 11px;
  font-weight: 700;
}

.showroom-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.showroom-price {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  font-feature-settings: "tnum";
  margin-bottom: 2px;
}

.showroom-price-sub {
  font-size: 11.5px;
  color: var(--label-tertiary);
  margin-bottom: 14px;
}

/* ─── Closing Panel (Ficha de Cierre) ──────────────────── */
.closing-card-panel {
  background: #0b1017;
  border: 1px solid var(--separator);
  border-radius: var(--radius-xl);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.closing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--separator);
}

.closing-title {
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
}

.closing-grid-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.closing-data-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.closing-lbl {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--label-tertiary);
  margin-bottom: 4px;
}

.closing-val {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.closing-val.gold {
  color: #f59e0b;
}

.closing-val.teal {
  color: #2dd4bf;
}
`;

// Append to globals.css if not already present
if (!css.includes('HIGH-TICKET EXECUTIVE COMPONENTS')) {
  css += '\n' + highTicketComponentsCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ Added High-Ticket Components CSS to globals.css');
} else {
  console.log('ℹ️ High-Ticket Components CSS already present');
}

