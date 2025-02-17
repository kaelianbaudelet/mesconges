import { Lexend } from "./fonts";

import type { Metadata } from "next";
import type { Viewport } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

// Ensure the SITE_URL is used correctly
const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mes congés",
    template: `%s — ${"Mes congés"}`,
  },
  description:
    "Application dédiée à la gestion des vœux de congés.",
  applicationName: "Mes congés",
  generator: "Next.js",
  referrer: "origin",
  creator: "Kaelian BAUDELET",
  publisher: "Kaelian BAUDELET",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon/favicon.svg" },
      {
        url: new URL("/favicon/favicon.svg", SITE_URL),
        sizes: "any",
        type: "image/svg+xml",
      },
      { url: "/favicon/favicon-196x196.png" },
      { url: "/favicon/favicon-128x128.png" },
      { url: "/favicon/favicon-96x96.png" },
      { url: "/favicon/favicon-32x32.png" },
      { url: "/favicon/favicon-16x16.png" },
      { url: "/favicon/favicon.ico" },
      {
        url: "/favicon/favicon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: ["/favicon/favicon.ico"],
    apple: [
      {
        url: "/favicon/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/favicon/apple-touch-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  manifest: `${SITE_URL}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Mes congés",
    description:
      "Application dédiée à la gestion des vœux de congés",
    siteName: "Mes congés",
    images: [{ url: `${SITE_URL}/social-image.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mes congés",
    description:
      "Application dédiée à la gestion des vœux de congés",
    images: [{ url: `${SITE_URL}/social-image.png` }],
  },
  appleWebApp: {
    capable: true,
    title: "Mes congés",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  category: "Application Web",
  classification: "Application/Service Web",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066cc" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
  colorScheme: "light dark",
};

// No explicit typing on props; let Next.js handle it
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${Lexend.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
