import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files' }, { status: 400 })
    }

    // Save placeholder data to test database connection
    const results = await Promise.all(files.map(async (file) => {
      const docRef = await adminDb.collection('media').add({
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
        category: category,
        uploadMethod: 'placeholder',
        createdAt: new Date()
      })
      
      return { 
        id: docRef.id, 
        originalName: file.name, 
        url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
        category: category
      }
    }))

    return NextResponse.json({ success: true, files: results })
  } catch (error) {
    console.error('Test upload error:', error)
    return NextResponse.json({ 
      error: 'Test upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}