// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SoundControl from "@/components/SoundControl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dentify",
  description: "Sistema de Identificação Odontológica",
  icons: {
    icon: "/assets/Logo.png", // Ícone padrão (favicon)
    apple: "/assets/Logo.png", // Ícone para iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/assets/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/assets/Logo.png" />

        {/* Outros ícones podem ser adicionados aqui se necessário */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        {children}
        <SoundControl />
      </body>
    </html>
  );
}
