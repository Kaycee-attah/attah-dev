import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: 'Attah Kelechi — Frontend Developer',
    template: '%s | Attah Kelechi',
  },
  description:
    "Frontend Developer building production-grade web applications and APIs. Computer Engineering finalist at Redeemer's University. First Class, 4.79 GPA.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    'Frontend Developer',
    'React Developer Nigeria',
    'Next.js Developer',
    'TypeScript',
    'Attah Kelechi',
    'Lagos Developer',
    'Nigerian Developer',
  ],
  authors: [{ name: 'Attah Kelechi' }],
  creator: 'Attah Kelechi',
  metadataBase: new URL('https://attah-dev.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://attah-dev.vercel.app',
    siteName: 'Attah Kelechi',
    title: 'Attah Kelechi — Frontend Developer',
    description: 'Frontend Developer building production-grade web applications. Based in Nigeria.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Attah Kelechi — Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attah Kelechi — Frontend Developer',
    description: 'Frontend Developer building production-grade web applications. Based in Nigeria.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmMono.variable} antialiased`}
    >
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ThemeProvider>
          <AnalyticsTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}