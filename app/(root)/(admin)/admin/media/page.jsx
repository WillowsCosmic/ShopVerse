'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Trash2, RefreshCw } from 'lucide-react'
import axios from 'axios'
import React, { useState } from 'react'
import { alert } from '@/lib/sweetAlert'
import Swal from 'sweetalert2'

const breadcrumbData = [
    {href: ADMIN_DASHBOARD, label:'Home'},
    {href: '', label:'Media'},
]

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState('SD')
  const [selectedMedia, setSelectedMedia] = useState([])
  
  const fetchMedia = async (page, deleteType) => {
    try {
      const { data: response } = await axios.get(`/api/upload?page=${page}&limit=10&deleteType=${deleteType}`)
      return response
    } catch (error) {
      console.error('Fetch media error:', error)
      throw error
    }
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: async({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length
      return lastPage?.hasMore ? nextPage : undefined
    }
  })

  const handleDelete = async (mediaId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return
    
    try {
      const response = await axios.delete('/api/upload', {
        data: { id: mediaId }  // Send ID in request body
      })
      
      if (response.data.success) {
        await refetch()
        setSelectedMedia(prev => prev.filter(id => id !== mediaId))
        alert('success', 'Media deleted successfully!')
      } else {
        throw new Error(response.data.error || 'Delete failed')
      }
    } catch (error) {
      alert('error', 'Failed to delete media: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) return
    
    // SweetAlert confirmation dialog for bulk delete
    const result = await Swal.fire({
      title: 'Delete Selected Media?',
      text: `This will delete ${selectedMedia.length} media files permanently!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, delete ${selectedMedia.length} files!`,
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    try {
      const deletePromises = selectedMedia.map(mediaId => 
        axios.delete('/api/upload', {
          data: { id: mediaId }  // Send ID in request body
        })
      )
      
      await Promise.all(deletePromises)
      
      await refetch()
      setSelectedMedia([])
      alert('success', `${selectedMedia.length} media files deleted successfully!`)
    } catch (error) {
      console.error('Bulk delete failed:', error)
      alert('error', 'Failed to delete some media files: ' + error.message)
    }
  }

  const selectAll = () => {
    const allMediaIds = data?.pages?.flatMap(page => 
      page?.mediaData?.map(media => media._id) || []
    ) || []
    setSelectedMedia(allMediaIds)
  }

  const deselectAll = () => {
    setSelectedMedia([])
  }

  const totalItems = data?.pages?.reduce((acc, page) => acc + (page?.mediaData?.length || 0), 0) || 0

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}/>
      <Card className={"py-0 rounded shadow-sm"}>
        <CardHeader className="py-2 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">Media</h4>
            <div className="flex items-center gap-3">
              {selectedMedia.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMedia.length} selected
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              )}
              
              <UploadMedia />
            </div>
          </div>
          
          {totalItems > 0 && (
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalItems} media files
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectAll}
                  className="h-7 text-xs"
                  disabled={totalItems === 0}
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={deselectAll}
                  className="h-7 text-xs"
                  disabled={selectedMedia.length === 0}
                >
                  Deselect All
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-4">
          {status === 'pending' ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading media files...</span>
            </div>
          ) : status === 'error' ? (
            <div className='text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-800'>
              <h5 className="font-medium mb-2">Error loading media:</h5>
              <p>{error?.message || 'Unknown error'}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => refetch()}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No media files found</p>
              
            </div>
          ) : (
            <>
              <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mb-6'>
                {data?.pages?.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page?.mediaData
                      ?.filter(media => media && media._id)
                      ?.map((media) => (
                        <Media 
                          key={media._id}
                          media={media}
                          handleDelete={handleDelete}
                          deleteType={deleteType}
                          selectedMedia={selectedMedia}
                          setSelectedMedia={setSelectedMedia}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </div>

              {hasNextPage && (
                <div className="text-center">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    className="min-w-32"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MediaPage

