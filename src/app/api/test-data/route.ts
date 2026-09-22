import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    if (type === 'post') {
      // Create a test published post
      const testPost = {
        title: 'Test Published Post',
        slug: 'test-published-post',
        excerpt: 'This is a test post to verify the display functionality.',
        content: 'This is a test post created to verify that published posts appear on the website.',
        category: 'Test',
        tags: ['test'],
        isPublished: true,
        isFeatured: false,
        readTime: 2,
        authorId: 'test-author',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await adminDb.collection('posts').add(testPost)
      return NextResponse.json({ 
        success: true, 
        message: 'Test post created',
        id: docRef.id,
        data: testPost
      })
    }

    if (type === 'project') {
      // Create a test active project
      const testProject = {
        title: 'Test Active Project',
        description: 'This is a test project to verify the display functionality.',
        category: 'Test',
        technologies: ['React', 'Next.js'],
        isActive: true,
        isFeatured: false,
        authorId: 'test-author',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await adminDb.collection('projects').add(testProject)
      return NextResponse.json({ 
        success: true, 
        message: 'Test project created',
        id: docRef.id,
        data: testProject
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    console.error('Test data creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create test data',
      details: error.message
    }, { status: 500 })
  }
}