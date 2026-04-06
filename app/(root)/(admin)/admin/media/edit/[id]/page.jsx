"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { showToast } from '@/lib/toast'
import axios from 'axios'

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home'
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: 'Media'
  },
  {
    href: "",
    label: 'Edit Media'
  },
]


const EditMedia = ({ params }) => {

  const onSubmit = async (values) => {
    try {
      setLoading(true)

      const { data: response } = await axios.put('/api/media/update', values)
      if (!response.success) { 
        throw new Error(response.message)
      }
      
      showToast('success', response.message)
    } catch (error) {

      showToast('error', error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  const { id } = use(params)
  const { data: mediaData } = useFetch(`/api/media/get/${id}`)
  const [loading, setLoading] = useState(false)
  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true

  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  }) 

  useEffect(() => {
      if(mediaData && mediaData.success){
        const data = mediaData.data
        form.reset({
          _id: data._id,
          alt:data.alt,
          title:data.title
        })
      }
  }, [mediaData])
  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />
      <Card className={"py-0 rounded shadow-sm"}>
        <CardHeader className="py-2 px-3 border-b">
          <h3 className="font-semibold text-bold">
            Edit Media
          </h3>
        </CardHeader>

        <CardContent className="p-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <img
                  src={mediaData?.data?.secure_url || imgPlaceholder}
                  width={200}
                  height={200}
                  alt={mediaData?.alt || 'Image'}
                  className='mb-5'
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-800">Alt</FormLabel>
                      <FormControl>
                        <Input type="alt" placeholder="Enter alt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-800">Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <ButtonLoading loading={loading} type="Submit" text="Update Media" className="cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditMedia