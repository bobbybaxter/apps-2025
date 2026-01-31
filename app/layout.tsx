import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import React from 'react';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Apps 2025',
  description: 'Application stats for 2025 layoff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
