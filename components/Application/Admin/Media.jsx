'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Trash2, Download, MoreVertical, Copy } from 'lucide-react'
import { alert } from '@/lib/sweetAlert'
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoute'
import { MdOutlineEdit } from 'react-icons/md'
import Link from 'next/link'

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleSelect = (mediaId) => {
    setSelectedMedia(prev =>
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(media.path)
    // You can add a toast notification here if you have one
    alert('success', 'Link copied to clipboard!')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = media.path
    link.download = media.filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const isSelected = selectedMedia.includes(media._id)

  return (
    <div className={`relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
      border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}>

      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => handleSelect(media._id)}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white dark:border-gray-600"
        />
      </div>

      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 w-7 p-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              title="Actions"
            >
              <MoreVertical className="h-3 w-3 text-gray-700 dark:text-gray-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={ADMIN_MEDIA_EDIT(media._id)} className="flex items-center cursor-pointer">
                <MdOutlineEdit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(media._id)}
              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
        {!imageError ? (
          <>
            <Image
              src={media.path}
              alt={media.alt || media.title || 'Media image'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                console.warn('Next.js Image failed, trying fallback:', media.path)
                setImageError(true)
                setImageLoading(false)
              }}
              priority={false}
              quality={75}
            />

            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs">
            <div className="text-center">
              <div className="text-2xl mb-1">⚠️</div>
              <div>Failed to load</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Media