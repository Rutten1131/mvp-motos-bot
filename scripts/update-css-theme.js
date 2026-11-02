const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

const midnightTheme = `/* ==========================================================================
   MOTOS & MOTOS — HIGH TICKET EXECUTIVE MIDNIGHT THEME (#06090E)
   Designed for Dealership Owners & Commercial Directors ($7,000 USD)
   ========================================================================== */

:root {
  /* ─── Midnight Obsidian Luxury Palette ─── */
  --system-bg: #06090e;
  --system-bg-secondary: #0b1017;
  --system-bg-tertiary: #101725;
  --system-grouped-bg: #080d14;
  
  /* Materials & Glass Surfaces (Translucidez & Vignette) */
  --liquid-glass-regular: rgba(11, 16, 23, 0.88);
  --liquid-glass-clear: rgba(15, 23, 42, 0.65);
  --liquid-glass-thick: rgba(11, 16, 23, 0.96);
  --sidebar-material: rgba(8, 13, 20, 0.94);
  --glass-blur: blur(28px) saturate(180%);
  --glass-blur-subtle: blur(16px) saturate(160%);
  
  /* Precision Borders & Hairlines */
  --separator: rgba(255, 255, 255, 0.08);
  --separator-subtle: rgba(255, 255, 255, 0.04);
  --separator-strong: rgba(255, 255, 255, 0.15);
  --hairline-highlight: 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 1px 0 0 rgba(255, 255, 255, 0.12) inset;
  
  /* Labels & Text Hierarchy (High Contrast on Obsidian) */
  --label-primary: #f8fafc;
  --label-secondary: #94a3b8;
  --label-tertiary: #64748b;
  --label-quaternary: #475569;
  
  /* High-Ticket Semantic Accents (Turquoise, Gold, Emerald) */
  --accent-teal: #14b8a6;
  --accent-teal-soft: rgba(20, 184, 166, 0.14);
  --accent-gold: #f59e0b;
  --accent-gold-soft: rgba(245, 158, 11, 0.14);
  --accent-emerald: #10b981;
  --accent-emerald-soft: rgba(16, 185, 129, 0.14);
  --apple-blue: #38bdf8;
  --apple-blue-hover: #0284c7;
  --apple-blue-soft: rgba(56, 189, 248, 0.14);
  --apple-green: #2dd4bf;
  --apple-green-soft: rgba(45, 212, 191, 0.14);
  --apple-orange: #fbbf24;
  --apple-orange-soft: rgba(251, 191, 36, 0.14);
  --apple-red: #f43f5e;
  --apple-red-soft: rgba(244, 63, 94, 0.14);
  --apple-purple: #c084fc;
  --apple-purple-soft: rgba(192, 132, 252, 0.14);
  --apple-teal: #14b8a6;
  --apple-teal-soft: rgba(20, 184, 166, 0.14);
  
  /* Typography Scale */
  --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif;
  --font-mono: "SF Mono", Monaco, Menlo, Consolas, monospace;
  
  /* Squircle Radius */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 26px;
  --radius-pill: 9999px;
  
  /* Deep Obsidian Shadows */
  --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.5);
  --shadow-card: 0 8px 32px -4px rgba(0, 0, 0, 0.65), 0 2px 8px -1px rgba(0, 0, 0, 0.5);
  --shadow-elevated: 0 20px 48px -8px rgba(0, 0, 0, 0.8), 0 4px 16px -2px rgba(0, 0, 0, 0.6);
  --shadow-modal: 0 32px 80px -12px rgba(0, 0, 0, 0.9);
}
`;

// Replace everything up to Global Reset
const resetIndex = css.indexOf('/* ─── Global Reset');
if (resetIndex !== -1) {
  css = midnightTheme + '\n' + css.substring(resetIndex);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ Global CSS updated with Midnight Obsidian Theme variables');
} else {
  console.error('❌ Could not find Global Reset anchor in globals.css');
}

