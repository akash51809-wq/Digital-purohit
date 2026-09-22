import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    // Get all posts (published and unpublished)
    const allPostsSnapshot = await adminDb.collection('posts').get()
    const allPosts = allPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Get only published posts
    const publishedSnapshot = await adminDb.collection('posts')
      .where('isPublished', '==', true)
      .get()
    const publishedPosts = publishedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      allPosts: allPosts,
      publishedPostsData: publishedPosts
    })
  } catch (error) {
    console.error('Test DB error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}