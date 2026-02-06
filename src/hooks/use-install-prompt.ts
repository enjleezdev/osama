"use client";

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // منع ظهور شريط التثبيت التلقائي للمتصفح
      e.preventDefault();
      // تخزين الحدث ليتم استخدامه لاحقاً
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    
    // إظهار واجهة التثبيت
    deferredPrompt.prompt();
    
    // الانتظار لمعرفة قرار المستخدم
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    // تنظيف الحالة بعد الاستخدام
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, promptInstall };
}
