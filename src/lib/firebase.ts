
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

/**
 * إعدادات الربط مع مخازن Osama Mobile السحابية
 */
const firebaseConfig = {
  apiKey: "AIzaSyDCWm6xoev5JAYtRLo51BkFyYyn---_JJA",
  authDomain: "osama-mobile.firebaseapp.com",
  projectId: "osama-mobile",
  storageBucket: "osama-mobile.firebasestorage.app",
  messagingSenderId: "365943909277",
  appId: "1:365943909277:web:dd55961fb7072f01179d74",
  measurementId: "G-VVEBGDMMWW"
};

// تهيئة التطبيق
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تهيئة Firestore مع دعم التخزين المحلي المتقدم (عشان يشتغل بدون إنترنت)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

// تفعيل الدخول المجهول تلقائياً عشان البيانات تكون محمية وسرية للمحل فقط
if (typeof window !== "undefined") {
  signInAnonymously(auth).catch(err => console.error("فشل الاتصال بـ Firebase:", err));
}

export { db, auth };
