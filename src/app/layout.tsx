import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';

export const viewport: Viewport = {
  themeColor: '#0C2B4E',
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
        <link rel="apple-touch-icon" href="https://placehold.co/180x180/F4F4F4/0C2B4E?text=Osama" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  console.log('ServiceWorker active');
                }).catch(function(err) {
                  console.log('ServiceWorker error', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
