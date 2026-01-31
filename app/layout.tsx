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
  title: 'Job Search Analytics Dashboard | Bob Baxter',
  description: 'A comprehensive, data-driven dashboard tracking job search metrics, interview performance, and hiring pipeline statistics. Built to demonstrate technical skills and provide transparency into the job search process.',
  keywords: ['job search', 'analytics', 'dashboard', 'interview metrics', 'job applications', 'data visualization'],
  openGraph: {
    title: 'Job Search Analytics Dashboard | Bob Baxter',
    description: 'A comprehensive, data-driven dashboard tracking job search metrics and interview performance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Search Analytics Dashboard | Bob Baxter',
    description: 'A comprehensive, data-driven dashboard tracking job search metrics and interview performance.',
  },
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
