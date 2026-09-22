import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const snapshot = await adminDb.collection('media')
      .where('category', '==', params.category)
      .get()
    
    const media = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }))
    
    // Sort by createdAt in JavaScript
    media.sort((a: any, b: any) => {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt)
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    console.log(`Category ${params.category} API returning:`, media.length, 'items')
    return NextResponse.json(media)
  } catch (error) {
    console.error(`Category ${params.category} API error:`, error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}
