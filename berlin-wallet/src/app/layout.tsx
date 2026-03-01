import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { Toaster } from "react-hot-toast";

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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1c1f23',
                color: '#fff',
                border: '1px solid #2a2d32',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#FFD700', secondary: '#1c1f23' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#1c1f23' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
