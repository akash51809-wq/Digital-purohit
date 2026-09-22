import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files' }, { status: 400 })
    }

    // Just save file info without actual upload
    const results = await Promise.all(files.map(async (file) => {
      const docRef = await adminDb.collection('media').add({
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: 'https://via.placeholder.com/400x300',
        category: 'test',
        createdAt: new Date()
      })
      
      return { id: docRef.id, name: file.name, url: 'https://via.placeholder.com/400x300' }
    }))

    return NextResponse.json({ success: true, files: results })
  } catch (error) {
    console.error('Simple upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}