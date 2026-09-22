import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Generate a signed upload signature for client-side uploads
 * This allows direct uploads from browser to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { folder = 'veliora-techworks', timestamp } = body

    if (!timestamp) {
      return NextResponse.json(
        { error: 'Timestamp is required' },
        { status: 400 }
      )
    }

    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 500 }
      )
    }

    // Parameters to sign
    const params = {
      timestamp: timestamp,
      folder: folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined
    }

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    )

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    })
  } catch (error: any) {
    console.error('Signature generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate signature', details: error.message },
      { status: 500 }
    )
  }
}