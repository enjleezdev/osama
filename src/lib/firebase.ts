
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// ملاحظة: يجب وضع قيم الإعدادات الخاصة بك هنا من لوحة تحكم Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// تهيئة التطبيق
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تهيئة Firestore مع دعم التخزين المحلي المتقدم (Offline Persistence)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

// تفعيل الدخول المجهول فوراً لضمان وجود مستخدم مرخص للتعامل مع البيانات
if (typeof window !== "undefined") {
  signInAnonymously(auth).catch(err => console.error("Firebase Auth Error:", err));
}

export { db, auth };
