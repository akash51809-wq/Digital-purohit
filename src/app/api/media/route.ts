import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('media')
      .orderBy('createdAt', 'desc')
      .get()
    
    const media = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }))
    
    console.log('Media API returning:', media.length, 'items')
    return NextResponse.json(media)
  } catch (error) {
    console.error('Media API error:', error)
    // Try without orderBy if it fails
    try {
      const snapshot = await adminDb.collection('media').get()
      const media = snapshot.docs.map((doc: any) => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }))
      console.log('Media API (no order) returning:', media.length, 'items')
      return NextResponse.json(media)
    } catch (fallbackError) {
      console.error('Media API fallback error:', fallbackError)
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docRef = await adminDb.collection('media').add({ ...data, createdAt: new Date() })
    const media = { id: docRef.id, ...data }
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 })
  }
}
