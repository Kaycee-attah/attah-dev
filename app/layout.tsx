import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";

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
    default: "Attah Kelechi — Frontend Developer",
    template: "%s | Attah Kelechi",
  },
  description:
    "Frontend Developer building production-grade web applications and APIs. Computer Engineering finalist at Redeemer's University. First Class, 4.79 GPA.",
  keywords: [
    "Frontend Developer",
    "React Developer Nigeria",
    "Next.js Developer",
    "TypeScript",
    "Attah Kelechi",
  ],
  authors: [{ name: "Attah Kelechi" }],
  creator: "Attah Kelechi",
};

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
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}