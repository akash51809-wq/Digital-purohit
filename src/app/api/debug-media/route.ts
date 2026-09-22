import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('media').get()
    const media = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    })) as any[]
    
    return NextResponse.json({
      total: media.length,
      media: media,
      categories: Array.from(new Set(media.map(m => m.category || 'no-category')))
    })
  } catch (error) {
    console.error('Debug media error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}