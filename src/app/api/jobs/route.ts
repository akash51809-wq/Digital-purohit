import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('jobs')
      .where('isActive', '==', true)
      .get()
    
    const jobs = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      }
    })
    
    jobs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docRef = await adminDb.collection('jobs').add({
      ...data,
      createdAt: new Date(),
      isActive: true
    })
    return NextResponse.json({ id: docRef.id, ...data })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}