'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { showToast } from '@/lib/toast'
import axios from 'axios'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: '', label: 'Add Category' },
]
const AddCategory = () => {
  const [loading, setLoading] = useState(false)
  
  const formSchema = zSchema.pick({
    name:true,slug:true
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })
  useEffect(() => {
      const name = form.getValues('name')
      if(name){
        form.setValue('slug',slugify(name))
      }
  }, [form.watch('name')])
  

  const onSubmit = async (values) => {
      try {
        const {data: response} = await axios.post('/api/category/create',values)
        if(!response.success){
          throw new Error(response.message)
        }
        form.reset()
        showToast('success',response.message)
      } catch (error) {
        showToast('error',error.message)
      } finally {
        setLoading(false)
      }
  }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className={"py-0 rounded shadow-sm"}>
        <CardHeader className="py-2 px-3 border-b">
          <h3 className="font-semibold text-bold">
            Add Category
          </h3>
        </CardHeader>

        <CardContent className="p-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-800">Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-800">Slug</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <ButtonLoading loading={loading} type="Submit" text="Add Category" className="cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory