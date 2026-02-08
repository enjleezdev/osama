const CACHE_NAME = 'osama-mobile-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'
];

// تثبيت المحرك وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تنظيف الكاش القديم عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// استراتيجية التشغيل: حاول من الشبكة، وإذا فشلت (أوفلاين) خذ من الكاش
self.addEventListener('fetch', (event) => {
  // تخطي طلبات جوجل وسوبابيز لجلب أحدث البيانات دوماً إذا كان في إنترنت
  if (event.request.url.includes('supabase.co') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // إذا نجح الطلب، خذ نسخة منه للكاش وارجع الاستجابة
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // إذا فشل الطلب (أوفلاين)، ابحث عنه في الكاش
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // إذا كان الطلب لصفحة ولم نجدها، ارجع الصفحة الرئيسية (Offline Fallback)
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});