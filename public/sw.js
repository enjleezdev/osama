
const CACHE_NAME = 'osama-mobile-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'
];

// تثبيت الخدمة وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع الطلبات لضمان العمل بدون إنترنت
// ملاحظة: هذا المستمع ضروري جداً لظهور زر "تثبيت التطبيق" في المتصفح
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // إذا فشل الاتصال ولم يكن الملف في الكاش، نرجع الصفحة الرئيسية
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
