import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await adminDb.collection('services').doc(params.id).update({ ...data, updatedAt: new Date() })
    const updatedDoc = await adminDb.collection('services').doc(params.id).get()
    const service = { id: updatedDoc.id, ...updatedDoc.data() }
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const docRef = adminDb.collection('services').doc(params.id)
    const doc = await docRef.get()
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    await docRef.update({ 
      isActive: false,
      deletedAt: new Date()
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
