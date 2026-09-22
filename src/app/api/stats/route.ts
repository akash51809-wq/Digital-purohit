import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    // Fetch all documents and count in memory to avoid index requirements
    const [projectsSnap, postsSnap, servicesSnap, contactsSnap, teamSnap, jobsSnap] = await Promise.all([
      adminDb.collection('projects').get(),
      adminDb.collection('posts').get(),
      adminDb.collection('services').get(),
      adminDb.collection('contacts').get(),
      adminDb.collection('team').get(),
      adminDb.collection('jobs').get()
    ])

    // Count active items in memory
    const projectsCount = projectsSnap.docs.filter(doc => doc.data().isActive !== false).length
    const servicesCount = servicesSnap.docs.filter(doc => doc.data().isActive !== false).length

    return NextResponse.json({
      projects: projectsCount,
      posts: postsSnap.size,
      articles: postsSnap.size,
      services: servicesCount,
      contacts: contactsSnap.size,
      teamMembers: teamSnap.size,
      jobs: jobsSnap.size
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
