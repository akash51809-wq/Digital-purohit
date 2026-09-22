import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminStorage } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    console.log('Firebase upload request received')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for category: ${category}`)

    const bucket = adminStorage.bucket()
    
    const uploadPromises = files.map(async (file) => {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${category}/${timestamp}-${file.name}`
        
        // Upload to Firebase Storage
        const fileRef = bucket.file(filename)
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        })
        
        // Make file publicly accessible
        await fileRef.makePublic()
        
        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

        // Save to Firestore
        const docRef = await adminDb.collection('media').add({
          filename: filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: publicUrl,
          category: category,
          type: file.type,
          createdAt: new Date(),
          uploadMethod: 'firebase'
        })

        return { 
          id: docRef.id, 
          filename: filename, 
          originalName: file.name, 
          mimeType: file.type, 
          size: file.size, 
          url: publicUrl, 
          category: category,
          type: file.type,
          createdAt: new Date()
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        throw fileError
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    console.log(`Successfully uploaded ${uploadedFiles.length} files to Firebase`)
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length,
      method: 'firebase'
    }, { status: 200 })
  } catch (error) {
    console.error('Firebase upload error:', error)
    return NextResponse.json({ 
      error: 'Firebase upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}