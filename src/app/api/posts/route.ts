import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const snapshot = await adminDb.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      }
    })
    
    return NextResponse.json(posts, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate document size to prevent Firestore limit issues
    const dataSize = JSON.stringify(data).length
    if (dataSize > 900000) { // 900KB limit to stay under 1MB
      return NextResponse.json({ 
        error: 'Document too large. Please use external image URLs instead of base64 data.' 
      }, { status: 400 })
    }
    
    console.log('Creating post with data size:', dataSize, 'bytes')
    const postData = {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
    }
    const docRef = await adminDb.collection('posts').add(postData)
    const post = { id: docRef.id, ...postData }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
