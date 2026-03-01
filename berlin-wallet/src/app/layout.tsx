import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata: Metadata = {
  title: "Berlin Wallet - Fidelización de clientes con wallet digital",
  description: "Plataforma B2B para crear tarjetas de fidelización integradas con Apple Wallet y Google Wallet. Retén a tus clientes con tecnología real.",
  keywords: "fidelización, loyalty, wallet, apple wallet, google wallet, tarjetas, clientes, B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="theme-dark font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
