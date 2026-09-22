import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection('projects').doc(params.id).get()
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const project = { id: doc.id, ...doc.data() }
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    
    // Validate document size to prevent Firestore limit issues
    const dataSize = JSON.stringify(data).length
    if (dataSize > 900000) { // 900KB limit to stay under 1MB
      return NextResponse.json({ 
        error: 'Document too large. Please reduce image data or use external URLs.' 
      }, { status: 400 })
    }
    
    console.log('Updating project with data size:', dataSize, 'bytes')
    await adminDb.collection('projects').doc(params.id).update({ ...data, updatedAt: new Date() })
    const updatedDoc = await adminDb.collection('projects').doc(params.id).get()
    const project = { id: updatedDoc.id, ...updatedDoc.data() }
    return NextResponse.json(project)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Soft delete by setting isActive to false
    await adminDb.collection('projects').doc(params.id).update({ 
      isActive: false,
      deletedAt: new Date()
    })
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
