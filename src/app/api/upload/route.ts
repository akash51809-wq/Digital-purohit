import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { adminDb } from '@/lib/firebase-admin'
import { UPLOAD_LIMITS, isValidFileType, isValidFileSize, sanitizeHtml } from '@/lib/security'

// Configure Cloudinary with explicit configuration
const configureCloudinary = () => {
  const config = {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }
  
  console.log('Configuring Cloudinary with:', {
    cloud_name: config.cloud_name ? 'present' : 'missing',
    api_key: config.api_key ? 'present' : 'missing',
    api_secret: config.api_secret ? 'present' : 'missing'
  })
  
  cloudinary.config(config)
  return config
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== UPLOAD REQUEST START ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Deployment platform:', process.env.VERCEL ? 'Vercel' : 'Other')
    
    // Configure Cloudinary
    const cloudinaryConfig = configureCloudinary()
    
    // Validate Cloudinary configuration
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
      console.error('Cloudinary configuration incomplete:', {
        cloud_name: !!cloudinaryConfig.cloud_name,
        api_key: !!cloudinaryConfig.api_key,
        api_secret: !!cloudinaryConfig.api_secret
      })
      return NextResponse.json({ 
        error: 'Upload service not configured',
        details: 'Missing Cloudinary credentials',
        config: {
          cloud_name: !!cloudinaryConfig.cloud_name,
          api_key: !!cloudinaryConfig.api_key,
          api_secret: !!cloudinaryConfig.api_secret
        }
      }, { status: 500 })
    }

    // Test Cloudinary connection
    try {
      await cloudinary.api.ping()
      console.log('Cloudinary connection test: SUCCESS')
    } catch (pingError: any) {
      console.error('Cloudinary connection test failed:', {
        message: pingError.message,
        http_code: pingError.http_code,
        name: pingError.name
      })
      return NextResponse.json({
        error: 'Cloudinary connection failed',
        details: pingError.message,
        http_code: pingError.http_code
      }, { status: 500 })
    }
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = sanitizeHtml(formData.get('category') as string || 'general')

    console.log(`Received ${files.length} files for category: ${category}`)

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate number of files
    if (files.length > UPLOAD_LIMITS.MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ 
        error: `Too many files. Maximum ${UPLOAD_LIMITS.MAX_FILES_PER_REQUEST} files allowed per request` 
      }, { status: 400 })
    }

    // Validate each file
    for (const file of files) {
      console.log(`Validating file: ${file.name}, type: ${file.type}, size: ${file.size}`)
      
      if (!isValidFileType(file.type)) {
        return NextResponse.json({ 
          error: `Invalid file type: ${file.type}. Allowed types: ${UPLOAD_LIMITS.ALLOWED_TYPES.join(', ')}` 
        }, { status: 400 })
      }
      
      if (!isValidFileSize(file.size)) {
        return NextResponse.json({ 
          error: `File too large: ${file.name}. Maximum size: ${UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB` 
        }, { status: 400 })
      }
    }
    
    const uploadPromises = files.map(async (file, index) => {
      try {
        console.log(`=== PROCESSING FILE ${index + 1}/${files.length}: ${file.name} ===`)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log(`File converted to buffer, size: ${buffer.length} bytes`)

        const uploadOptions = {
          folder: 'veliora-techworks',
          resource_type: 'auto' as const,
          quality: 'auto:good' as const,
          timeout: 120000, // Increased timeout for production
          use_filename: true,
          unique_filename: true,
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx'],
          transformation: file.type.startsWith('image/') ? [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ] : undefined
        }

        console.log('Upload options:', uploadOptions)

        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) {
                console.error(`Cloudinary upload error for ${file.name}:`, {
                  message: error.message,
                  http_code: error.http_code,
                  name: error.name,
                  error: error
                })
                reject(error)
              } else {
                console.log(`Cloudinary upload success for ${file.name}:`, {
                  public_id: result?.public_id,
                  secure_url: result?.secure_url,
                  format: result?.format
                })
                resolve(result)
              }
            }
          )
          
          uploadStream.on('error', (streamError) => {
            console.error('Upload stream error:', streamError)
            reject(streamError)
          })
          
          uploadStream.end(buffer)
        })

        // Save to Firestore
        console.log(`Saving to Firestore: ${result.public_id}`)
        const docRef = await adminDb.collection('media').add({
          filename: result.public_id,
          originalName: sanitizeHtml(file.name),
          mimeType: file.type,
          size: file.size,
          url: result.secure_url,
          category: category,
          type: file.type,
          uploadMethod: 'cloudinary',
          uploadedBy: 'system',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        console.log(`Firestore document created: ${docRef.id}`)

        return { 
          id: docRef.id, 
          filename: result.public_id, 
          originalName: sanitizeHtml(file.name), 
          mimeType: file.type, 
          size: file.size, 
          url: result.secure_url, 
          category: category,
          type: file.type,
          createdAt: new Date()
        }
      } catch (fileError: any) {
        console.error(`=== ERROR PROCESSING FILE ${file.name} ===`, {
          message: fileError.message,
          http_code: fileError.http_code,
          name: fileError.name,
          stack: fileError.stack
        })
        throw new Error(`Failed to upload ${file.name}: ${fileError.message || 'Unknown error'}`)
      }
    })

    console.log('Starting parallel uploads...')
    const uploadedFiles = await Promise.all(uploadPromises)
    console.log(`=== UPLOAD COMPLETE: ${uploadedFiles.length} files uploaded successfully ===`)
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length,
      method: 'cloudinary',
      timestamp: new Date().toISOString()
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('=== UPLOAD ERROR ===', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      http_code: error.http_code
    })
    
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message || 'Unknown error',
      http_code: error.http_code,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}