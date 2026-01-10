import type { Metadata } from "next";
import { Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pecho's Inmobiliaria - Alquiler de Casas en Pisco",
  description: "Encuentra tu casa ideal en Pisco, Perú. Alquiler por días y meses.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${robotoMono.variable} bg-[#EEE8DF] text-[#2C2621] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
