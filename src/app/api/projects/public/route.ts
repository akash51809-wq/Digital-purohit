import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 300
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching public projects...')
    
    const snapshot = await adminDb.collection('projects').get()
    
    console.log(`Found ${snapshot.docs.length} total projects in database`)
    
    const allProjects = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firebase Timestamp to serializable format
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      }
    })
    
    // Filter active projects (show if isActive is true or undefined)
    const activeProjects = allProjects.filter((project: any) => {
      console.log(`Project "${project.title}": isActive = ${project.isActive}`)
      return project.isActive !== false
    })
    
    console.log(`Found ${activeProjects.length} active projects`)
    
    // Sort by createdAt
    activeProjects.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json(activeProjects, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    })
  } catch (error) {
    console.error('Projects public API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
