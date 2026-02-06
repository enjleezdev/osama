import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const viewport: Viewport = {
  themeColor: '#23b936',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'أســــــــامه لخدمات الموبايل | نظام إدارة الصيانة',
  description: 'تتبع خدمات الأجهزة باحترافية مع نظام الباركود المتكامل.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'أسامة موبايل',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://placehold.co/180x180/23b936/white?text=Osama" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
