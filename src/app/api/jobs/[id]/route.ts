import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await adminDb.collection('jobs').doc(params.id).update(data)
    return NextResponse.json({ id: params.id, ...data })
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await adminDb.collection('jobs').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}