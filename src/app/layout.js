import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import HeroUIProvider
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from '@/core/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | CodeArena',
    default: 'CodeArena',
  },
  description: "Strengthen your programming expertise",
  icons: {
    icon: [
      { url: '/CodeArenaLogoNoText.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/CodeArenaLogoNoText.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/CodeArenaLogoNoText.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/CodeArenaLogoNoText.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-mahindra-navy-blue min-h-screen`}
      >
        {/* Wrap the app with HeroUIProvider */}
        <HeroUIProvider>
          <AuthProvider>
            <main className="dark">
              {children}
            </main>
          </AuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}