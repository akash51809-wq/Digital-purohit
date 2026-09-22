import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('services')
      .limit(50)
      .get()
      
    // Filter active services in memory and convert Firestore timestamps
    const services = snapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        }
      })
      .filter((service: any) => service.isActive !== false)
      .sort((a: any, b: any) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
    
    return NextResponse.json(services, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    })
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch services',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // Add required fields
    const serviceData = {
      ...data,
      createdAt: new Date(),
      order: Date.now() // Simple ordering by creation time
    }
    const docRef = await adminDb.collection('services').add(serviceData)
    return NextResponse.json({ id: docRef.id, ...serviceData })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
