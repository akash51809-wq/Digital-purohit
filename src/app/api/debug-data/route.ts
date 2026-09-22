import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get('collection') || 'posts'

    console.log(`Debugging ${collection} collection...`)

    // Get all documents from the specified collection
    const snapshot = await adminDb.collection(collection).get()
    
    const documents = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firebase Timestamps to readable format
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      }
    })

    console.log(`Found ${documents.length} documents in ${collection}`)

    // Additional analysis for posts
    if (collection === 'posts') {
      const publishedPosts = documents.filter((doc: any) => doc.isPublished === true)
      const unpublishedPosts = documents.filter((doc: any) => doc.isPublished !== true)
      
      return NextResponse.json({
        collection,
        totalDocuments: documents.length,
        publishedPosts: publishedPosts.length,
        unpublishedPosts: unpublishedPosts.length,
        documents: documents.map(doc => ({
          id: doc.id,
          title: (doc as any).title,
          isPublished: (doc as any).isPublished,
          category: (doc as any).category,
          createdAt: doc.createdAt,
          hasImage: !!(doc as any).image,
          imageUrl: (doc as any).image
        })),
        sampleDocument: documents[0] || null
      })
    }

    // Additional analysis for projects
    if (collection === 'projects') {
      const activeProjects = documents.filter((doc: any) => doc.isActive !== false)
      const inactiveProjects = documents.filter((doc: any) => doc.isActive === false)
      
      return NextResponse.json({
        collection,
        totalDocuments: documents.length,
        activeProjects: activeProjects.length,
        inactiveProjects: inactiveProjects.length,
        documents: documents.map(doc => ({
          id: doc.id,
          title: (doc as any).title,
          isActive: (doc as any).isActive,
          category: (doc as any).category,
          createdAt: doc.createdAt,
          hasImage: !!(doc as any).image,
          imageUrl: (doc as any).image
        })),
        sampleDocument: documents[0] || null
      })
    }

    // Generic response for other collections
    return NextResponse.json({
      collection,
      totalDocuments: documents.length,
      documents: documents.slice(0, 10), // Limit to first 10 for readability
      sampleDocument: documents[0] || null
    })

  } catch (error: any) {
    console.error('Debug data error:', error)
    return NextResponse.json({
      error: 'Failed to fetch data',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}