# أســــــــامه لخدمات الموبايل

نظام إدارة صيانة متكامل مع دعم الباركود وتطبيق ويب (PWA).

## تعليمات Git الهامة

### دمج التغييرات (Merge)
لدمج فرع التنسيقات `style` في الفرع الرئيسي `main`:
1. الانتقال للفرع الرئيسي: `git checkout main`
2. دمج الفرع: `git merge style`
3. رفع التغييرات: `git push origin main`

### إدارة الفروع (Branches)
لحذف فرع محلي بعد الانتهاء منه (مثلاً فرع `sudan`):
* **الحذف الآمن (Safe Delete):** 
  `git branch -d sudan`
* **الحذف الإجباري (Force Delete):** 
  (استخدم هذا إذا ظهر خطأ "not fully merged")
  `git branch -D sudan`

---
تم التطوير بواسطة **ENJLEEZ TECH**
https://tech.enjleez.cloud/ar
