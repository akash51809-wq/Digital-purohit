import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts').get()
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        isPublished: data.isPublished,
        hasIsPublished: 'isPublished' in data,
        publishedType: typeof data.isPublished
      }
    })
    
    return NextResponse.json({
      total: posts.length,
      posts
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
