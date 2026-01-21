import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

if (import.meta.env.DEV) {
  // Connect emulators
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  connectAuthEmulator(auth, "http://127.0.0.1:9099")

  // Auto-login for local development (NO UI yet)
  signInWithEmailAndPassword(auth, "user1@test.com", "password123")
    .then(() => {
      console.log("[Auth Emulator] Auto-login success")
    })
    .catch((err) => {
      console.warn("[Auth Emulator] Auto-login failed", err?.code || err)
    })
}
