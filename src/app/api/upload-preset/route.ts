import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ 
        error: 'Cloudinary not configured',
        details: { cloudName: !!cloudName, uploadPreset: !!uploadPreset }
      }, { status: 500 })
    }

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', uploadPreset)
    uploadFormData.append('folder', 'veliora-techworks')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudinary API error:', errorText)
      return NextResponse.json({
        error: 'Upload failed',
        details: `Cloudinary API returned ${response.status}`,
        response: errorText
      }, { status: 500 })
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: 'Upload failed',
      details: error.message
    }, { status: 500 })
  }
}