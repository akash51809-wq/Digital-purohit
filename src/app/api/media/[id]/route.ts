import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await adminDb.collection('media').doc(params.id).update(data)
    const doc = await adminDb.collection('media').doc(params.id).get()
    const media = { id: doc.id, ...doc.data() }
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await adminDb.collection('media').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
