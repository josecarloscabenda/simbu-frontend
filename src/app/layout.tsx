// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#00C3AD",
};

export const metadata: Metadata = {
  title: {
    default: "Simbu — Campanhas SMS & Email",
    template: "%s | Simbu",
  },
  description:
    "Plataforma SaaS para criacao, gestao e monitorizacao de campanhas SMS e Email em massa.",
  applicationName: "Simbu",
  icons: {
    icon: [{ url: "/icon" }],
  },
  openGraph: {
    title: "Simbu — Campanhas SMS & Email",
    description:
      "Crie campanhas, segmente contactos, acompanhe metricas e automatize envios.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={lato.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}