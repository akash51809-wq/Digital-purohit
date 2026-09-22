import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: {
        exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.substring(0, 5) + '...' : 'missing'
      },
      CLOUDINARY_API_KEY: {
        exists: !!process.env.CLOUDINARY_API_KEY,
        value: process.env.CLOUDINARY_API_KEY ? 
          process.env.CLOUDINARY_API_KEY.substring(0, 5) + '...' : 'missing'
      },
      CLOUDINARY_API_SECRET: {
        exists: !!process.env.CLOUDINARY_API_SECRET,
        value: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
      }
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Test Cloudinary connection
    let cloudinaryTest = null
    try {
      const result = await cloudinary.api.ping()
      cloudinaryTest = { success: true, result }
    } catch (error: any) {
      cloudinaryTest = { 
        success: false, 
        error: error.message,
        http_code: error.http_code,
        name: error.name
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      deployment: process.env.VERCEL ? 'Vercel' : 'Other',
      envVariables: envCheck,
      cloudinaryTest,
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'host': request.headers.get('host'),
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test upload with a simple base64 image
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'veliora-techworks/test',
      public_id: `test-${Date.now()}`,
      resource_type: 'image'
    })

    return NextResponse.json({
      success: true,
      message: 'Test upload successful',
      result: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test upload failed',
      message: error.message,
      http_code: error.http_code,
      name: error.name
    }, { status: 500 })
  }
}