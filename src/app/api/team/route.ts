import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('team')
      .get()
    
    const members = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      }
    })
    
    members.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    
    return NextResponse.json(members)
  } catch (error) {
    console.error('Get team members error:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docRef = await adminDb.collection('team').add({
      ...data,
      createdAt: new Date()
    })
    return NextResponse.json({ id: docRef.id, ...data })
  } catch (error) {
    console.error('Create team member error:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}