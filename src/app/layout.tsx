import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { CartProvider } from "@/lib/cart/cartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Poke Duwdu",
    template: "%s • Poke Duwdu",
  },
  description: "Loja de cartas Pokémon. Compre via WhatsApp e pague no Pix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-muted/30">
            <Container className="py-10 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Poke Duwdu. Compra finalizada via
              WhatsApp.
            </Container>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
