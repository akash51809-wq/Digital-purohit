import { adminDb } from './firebase-admin'

// Firebase helper functions
export const db = {
  user: {
    findUnique: async (where: { email: string }) => {
      const doc = await adminDb.collection('users').where('email', '==', where.email).limit(1).get()
      return doc.empty ? null : { id: doc.docs[0].id, ...doc.docs[0].data() }
    },
    create: async (data: any) => {
      const docRef = await adminDb.collection('users').add(data)
      return { id: docRef.id, ...data }
    }
  },
  service: {
    findMany: async () => {
      const snapshot = await adminDb.collection('services').orderBy('order').get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    }
  },
  project: {
    findMany: async () => {
      const snapshot = await adminDb.collection('projects').orderBy('order').get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    }
  },
  post: {
    findMany: async () => {
      const snapshot = await adminDb.collection('posts').where('isPublished', '==', true).get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    }
  },
  media: {
    findMany: async (where?: any) => {
      let query: any = adminDb.collection('media')
      if (where?.category) {
        query = query.where('category', '==', where.category)
      }
      const snapshot = await query.get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    },
    create: async (data: any) => {
      const docRef = await adminDb.collection('media').add(data)
      return { id: docRef.id, ...data }
    }
  }
}

// Legacy prisma export for compatibility
export const prisma = db