"use client"

import React, { useState, useRef, useCallback } from "react"
import { Upload, X, Image } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageChange: (file: File | null, previewUrl: string | null) => void
  onImageUploaded?: (url: string) => void
  className?: string
  title: string
  description: string
  acceptedTypes?: string[]
  maxSizeMB?: number
  aspectRatio?: 'square' | 'banner'
  suggestedDimensions?: string
}

export function ImageUpload({
  onImageChange,
  onImageUploaded,
  className,
  title,
  description,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  aspectRatio = 'banner',
  suggestedDimensions
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Please upload a valid image file (${acceptedTypes.map(type => type.split('/')[1]).join(', ')})`
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`
    }
    
    return null
  }, [acceptedTypes, maxSizeMB])

  const uploadToVercel = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload image')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleFile = useCallback(async (file: File) => {
    setUploadError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    onImageChange(file, objectUrl)

    // Upload to Vercel Blob
    if (onImageUploaded) {
      setIsUploading(true)
      try {
        const uploadedUrl = await uploadToVercel(file)
        onImageUploaded(uploadedUrl)
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
      } finally {
        setIsUploading(false)
      }
    }
  }, [validateFile, onImageChange, onImageUploaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const removeImage = useCallback(() => {
    setPreviewUrl(null)
    setUploadError(null)
    onImageChange(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onImageChange])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          previewUrl ? "border-solid" : "",
          uploadError ? "border-destructive" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="sr-only"
        />
        
        {previewUrl ? (
          <div className="relative">
            <div className={cn(
              "w-full max-w-md mx-auto overflow-hidden rounded-lg border bg-muted",
              aspectRatio === 'square' ? "aspect-square" : "aspect-[3/1]"
            )}>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation()
                removeImage()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="text-sm text-muted-foreground">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <Upload className="h-full w-full" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Drop image here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                {acceptedTypes.map(type => type.split('/')[1]).join(', ')} up to {maxSizeMB}MB
              </p>
              {suggestedDimensions && (
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested: {suggestedDimensions}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}
    </div>
  )
}