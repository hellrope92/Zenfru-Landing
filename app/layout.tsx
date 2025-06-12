import type { Metadata } from "next";
import { Inter, Space_Grotesk } from 'next/font/google';
import "./globals.css";

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Zenfru - AI-Powered Virtual Front Desk for Dental Practices",
    template: "%s | Zenfru"
  },
  description: "Never miss a patient call again. AI-powered virtual front desk that handles appointments, books patients, and manages calls 24/7. HIPAA compliant and seamlessly integrates with your PMS.",
  keywords: [
    "dental practice management", 
    "AI virtual assistant", 
    "dental appointment booking", 
    "HIPAA compliant", 
    "virtual front desk", 
    "dental practice automation",
    "patient scheduling",
    "dental answering service"
  ],
  authors: [{ name: "Zenfru" }],
  creator: "Zenfru",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zenfru.com",
    title: "Zenfru - AI-Powered Virtual Front Desk for Dental Practices",
    description: "Never miss a patient call again. AI-powered virtual front desk that handles appointments, books patients, and manages calls 24/7.",
    siteName: "Zenfru",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Zenfru - AI Virtual Front Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenfru - AI-Powered Virtual Front Desk",
    description: "Never miss a patient call again. AI-powered virtual front desk for dental practices.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-inter antialiased bg-white dark:bg-slate-900">
        {children}
      </body>
    </html>
  );
}