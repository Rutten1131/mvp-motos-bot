import type { Metadata } from "next";
import { Maven_Pro, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  variable: "--font-maven",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata: Metadata = { 
  title: "Motos & Motos — Centro Ejecutivo de Ventas & CRM IA",
  description: "Monitoreo en tiempo real de interacciones, conversiones e intenciones de clientes de Motos & Motos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${mavenPro.variable} ${libreBaskerville.variable}`}>
      <body>{children}</body>
    </html>
  );
}
