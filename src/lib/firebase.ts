
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

/**
 * يا بطل، هنا تحط مفاتيح الربط اللي نسختها من موقع Firebase
 * استبدل الكلمات اللي بين القوسين بالقيم الحقيقية اللي طلعت لك
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "ضع الـ apiKey هنا",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ضع الـ authDomain هنا",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ضع الـ projectId هنا",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ضع الـ storageBucket هنا",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "ضع الـ messagingSenderId هنا",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "ضع الـ appId هنا"
};

// تهيئة التطبيق
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تهيئة Firestore مع دعم التخزين المحلي المتقدم (عشان يشتغل بدون إنترنت)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

// تفعيل الدخول المجهول تلقائياً عشان البيانات تكون محمية
if (typeof window !== "undefined") {
  signInAnonymously(auth).catch(err => console.error("فشل الاتصال بـ Firebase:", err));
}

export { db, auth };
