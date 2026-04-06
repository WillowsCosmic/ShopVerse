
'use client'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/toast';
import React, { useRef, useState } from 'react'
import { Plus } from "lucide-react";
 
const UploadMedia = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState([])
  const fileInputRef = useRef(null)

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files)
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      
      if (!isValidType) {
        showToast('error', `${file.name} is not a valid image file`)
        return false
      }
      if (!isValidSize) {
        showToast('error', `${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      return true
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  // Remove file from selection
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.split('.')[0])
        formData.append('title', file.name.split('.')[0])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to upload ${file.name}`)
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      setUploadedMedia(prev => [...prev, ...results])
      setFiles([]) // Clear selected files
      
      showToast('success', "Files uploaded successfully")
      
    } catch (error) {
      console.error('Upload error:', error)
      showToast('error', 'Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="bg-amber-300 hover:bg-amber-400 dark:bg-amber-300 dark:hover:bg-amber-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Select Images
        </Button>
        
        {files.length > 0 && (
          <Button 
            onClick={uploadFiles}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
          </Button>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected Files:</h3>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  onClick={() => removeFile(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadMedia
