import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection('posts').doc(params.id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    const post = { id: doc.id, ...doc.data() }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    
    // Validate document size to prevent Firestore limit issues
    const dataSize = JSON.stringify(data).length
    if (dataSize > 900000) { // 900KB limit to stay under 1MB
      return NextResponse.json({ 
        error: 'Document too large. Please use external image URLs instead of base64 data.' 
      }, { status: 400 })
    }
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    // Only update createdAt if it's provided and different
    if (data.createdAt) {
      updateData.createdAt = new Date(data.createdAt)
    }
    
    await adminDb.collection('posts').doc(params.id).update(updateData)
    const updatedDoc = await adminDb.collection('posts').doc(params.id).get()
    const post = { id: updatedDoc.id, ...updatedDoc.data() }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await adminDb.collection('posts').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
