import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Candella — Sustainable businesses in Melbourne',
  description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
  verification: {
    google: '6aQpV6f4a07WVYO02zZhh1WI2tTTmTtaxLqrtpLlb8g',
  },
  openGraph: {
    title: 'Candella — Sustainable businesses in Melbourne',
    description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Candella',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og?name=Candella&suburb=Melbourne&category=Sustainable%20businesses`,
        width: 1200,
        height: 630,
        alt: 'Candella — Sustainable businesses in Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Candella — Sustainable businesses in Melbourne',
    description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
