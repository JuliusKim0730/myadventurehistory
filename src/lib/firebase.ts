import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase 설정 - 환경변수 또는 기본값 사용
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBrNt9RTr6o80RxFJn79-zFovIEf5-4TUc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "myadventurehistory.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "myadventurehistory",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "myadventurehistory.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1082105729340",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1082105729340:web:58d700852107b77b304e39",
}

// Firebase 앱 초기화 (중복 초기화 방지)
let app
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
} catch (error) {
  console.error('Firebase 초기화 오류:', error)
  app = initializeApp(firebaseConfig)
}

export { app }
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// 인증 함수들
export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider)
  } catch (error) {
    console.error('Google 로그인 오류:', error)
    throw error
  }
}

export async function signInAsGuest() {
  try {
    return await signInAnonymously(auth)
  } catch (error) {
    console.error('게스트 로그인 오류:', error)
    throw error
  }
}
