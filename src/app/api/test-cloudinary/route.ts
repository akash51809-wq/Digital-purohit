import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
  try {
    // Check if all required environment variables are present
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing Cloudinary configuration',
        config: {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret
        }
      }, { status: 500 })
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    // Test the connection by getting account details
    const result = await cloudinary.api.ping()
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudName: cloudName,
      status: result.status
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Cloudinary connection failed',
      details: error.message
    }, { status: 500 })
  }
}