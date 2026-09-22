import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import * as dotenv from 'dotenv'

dotenv.config()

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'velioratechworksportfolio',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@velioratechworksportfolio.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'velioratechworksportfolio.firebasestorage.app'
  })
}

export const adminDb = getFirestore()
export const adminStorage = getStorage()