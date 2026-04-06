
import path from 'path'
import fs from 'fs/promises'
import MediaModel from '@/models/Media.model'
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated } from '@/lib/helperFunction'
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const auth = await isAuthenticated('admin')
    
    if (!auth.isAuth) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()

    const formData = await request.formData()
    
    const uploadDir = path.join(process.cwd(), 'public/uploads/images')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    const files = formData.getAll('file')
    const alts = formData.getAll('alt')
    const titles = formData.getAll('title')

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const savedMedia = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (!file.type.startsWith('image/')) {
        continue
      }
      
      if (file.size > 5 * 1024 * 1024) {
        continue
      }

      const fileExtension = path.extname(file.name)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = `${file.name.replace(fileExtension, '')}-${uniqueSuffix}${fileExtension}`
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      // Build the full URL for secure_url
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const secureUrl = `${baseUrl}/uploads/images/${filename}`

      const mediaData = {
        path: `/uploads/images/${filename}`,
        thumbnail_url: `/uploads/images/${filename}`,
        secure_url: secureUrl, // ✅ Use full URL
        alt: alts[i] || file.name,
        title: titles[i] || file.name,
        originalName: file.name,
        filename: filename,
        mimetype: file.type,
        size: file.size,
      }

      const savedMediaRecord = await MediaModel.create(mediaData)
      savedMedia.push(savedMediaRecord)
    }

    const responseData = savedMedia.map(media => ({
      id: media._id,
      url: media.path,
      thumbnail: media.thumbnail_url,
      secure_url: media.secure_url,
      alt: media.alt,
      title: media.title,
      filename: media.filename,
      size: media.size,
    }))

    return Response.json({
      success: true,
      media: responseData,
      count: savedMedia.length,
      message: `${savedMedia.length} file(s) uploaded successfully`
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    return Response.json(
      { error: 'File upload failed: ' + error.message }, 
      { status: 500 }
    )
  }
}
export async function GET(request) {
  try {
    const auth = await isAuthenticated('admin')
    if(!auth.isAuth){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page'), 10) || 0;
    const limit = parseInt(searchParams.get('limit'), 10) || 10;
    const deleteType = searchParams.get('deleteType') || 'SD'; // ✅ Keep as string

    let filter = {}
    if(deleteType === 'SD'){
      filter = {deletedAt: null} // ✅ Fixed typo: deletedAt not deleteAt
    } else if(deleteType === 'PD'){
      filter = {deletedAt: {$ne: null}} // ✅ Fixed typo: deletedAt not deleteAt
    }

    const mediaData = await MediaModel.find(filter)
      .sort({createdAt: -1})
      .skip(page * limit)
      .limit(limit)
      .lean()
      
    const totalMedia = await MediaModel.countDocuments(filter)

    return NextResponse.json({
      success: true, // ✅ Add success field for consistency
      mediaData: mediaData,
      hasMore: (page + 1) * limit < totalMedia
    })
  } catch (error) {
    console.error('GET /api/upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media: ' + error.message }, 
      { status: 500 }
    )
  }
}
export async function DELETE(request) {
  try {
    const auth = await isAuthenticated('admin')
    
    if (!auth.isAuth) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()

    // Get ID from request body instead of params
    const body = await request.json()
    const { id } = body

    if (!id) {
      return Response.json({ error: 'Media ID is required' }, { status: 400 })
    }

    const media = await MediaModel.findById(id)
    
    if (!media) {
      return Response.json({ error: 'Media not found' }, { status: 404 })
    }

    try {
      const filePath = path.join(process.cwd(), 'public', media.path)
      await fs.unlink(filePath)
      console.log('File deleted from filesystem:', filePath)
    } catch (fileError) {
      console.warn('Could not delete file from filesystem:', fileError.message)
    }

    await MediaModel.findByIdAndDelete(id)

    return Response.json({
      success: true,
      message: 'Media deleted successfully',
      deletedId: id
    })

  } catch (error) {
    console.error('Delete media error:', error)
    return Response.json(
      { error: 'Failed to delete media: ' + error.message }, 
      { status: 500 }
    )
  }
}