import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAGm1mfmfivt6TTUFMo5QMGQE_IYCJ3fio",
  authDomain: "bakery-landing-dd6b9.firebaseapp.com",
  projectId: "bakery-landing-dd6b9",
  storageBucket: "bakery-landing-dd6b9.firebasestorage.app",
  messagingSenderId: "480563793439",
  appId: "1:480563793439:web:1a9e9f2627036e31838f2a",
  measurementId: "G-FQPC2HDY6J"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)