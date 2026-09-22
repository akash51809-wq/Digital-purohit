'use client'

interface UploadProgressProps {
  isUploading: boolean
  filesCount: number
  currentFile?: string
}

export default function UploadProgress({ isUploading, filesCount, currentFile }: UploadProgressProps) {
  if (!isUploading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Uploading Images
          </h3>
          <p className="text-gray-600 mb-4">
            Processing {filesCount} {filesCount === 1 ? 'file' : 'files'}...
          </p>
          {currentFile && (
            <p className="text-sm text-gray-500">
              Current: {currentFile}
            </p>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}