import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('users').get()
    const users = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      name: doc.data().name, 
      email: doc.data().email 
    }))
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
