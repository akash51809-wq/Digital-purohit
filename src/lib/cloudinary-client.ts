/**
 * Client-side Cloudinary upload utilities
 * Use this as an alternative to server-side uploads
 */

interface UploadSignature {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
  folder: string
}

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
}

/**
 * Get upload signature from server
 */
async function getUploadSignature(folder: string = 'veliora-techworks'): Promise<UploadSignature> {
  const timestamp = Math.round(new Date().getTime() / 1000)
  
  const response = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder, timestamp }),
  })

  if (!response.ok) {
    throw new Error('Failed to get upload signature')
  }

  return response.json()
}

/**
 * Upload file directly to Cloudinary from client
 */
export async function uploadToCloudinaryDirect(
  file: File,
  folder: string = 'veliora-techworks',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  try {
    // Get signed upload parameters
    const signatureData = await getUploadSignature(folder)
    
    // Prepare form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', signatureData.signature)
    formData.append('timestamp', signatureData.timestamp.toString())
    formData.append('api_key', signatureData.apiKey)
    formData.append('folder', signatureData.folder)

    // Upload directly to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText)
            resolve(result)
          } catch (error) {
            reject(new Error('Invalid response from Cloudinary'))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })
      
      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Direct upload error:', error)
    throw error
  }
}

/**
 * Upload multiple files with progress tracking
 */
export async function uploadMultipleToCloudinaryDirect(
  files: File[],
  folder: string = 'veliora-techworks',
  onProgress?: (fileIndex: number, progress: number) => void,
  onFileComplete?: (fileIndex: number, result: CloudinaryUploadResult) => void
): Promise<CloudinaryUploadResult[]> {
  const results: CloudinaryUploadResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      const result = await uploadToCloudinaryDirect(
        file,
        folder,
        (progress) => onProgress?.(i, progress)
      )
      
      results.push(result)
      onFileComplete?.(i, result)
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error)
      throw error
    }
  }
  
  return results
}

/**
 * Save uploaded media info to Firebase
 */
export async function saveMediaToFirebase(
  uploadResults: CloudinaryUploadResult[],
  category: string = 'general'
) {
  const response = await fetch('/api/media-save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: uploadResults.map(result => ({
        filename: result.public_id,
        originalName: result.public_id.split('/').pop(),
        mimeType: `image/${result.format}`,
        size: result.bytes,
        url: result.secure_url,
        category,
        type: result.resource_type,
        uploadMethod: 'cloudinary-direct'
      }))
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to save media info')
  }

  return response.json()
}