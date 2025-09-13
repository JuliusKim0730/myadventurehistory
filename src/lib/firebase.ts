// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrNt9RTr6o80RxFJn79-zFovIEf5-4TUc",
  authDomain: "myadventurehistory.firebaseapp.com",
  projectId: "myadventurehistory",
  storageBucket: "myadventurehistory.firebasestorage.app",
  messagingSenderId: "1082105729340",
  appId: "1:1082105729340:web:58d700852107b77b304e39",
  measurementId: "G-59C83LLBB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics는 클라이언트 사이드에서만 초기화
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics 초기화 완료');
  } catch (error) {
    console.warn('Firebase Analytics 초기화 실패:', error);
  }
}
export { analytics };

// Firebase 연결 상태 확인
console.log('Firebase 설정:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket
});

export default app;
