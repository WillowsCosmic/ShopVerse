
'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import { FaEye } from "react-icons/fa";
import { PiEyeClosedDuotone } from "react-icons/pi";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ButtonLoading from '@/components/Application/ButtonLoading'
import { z } from 'zod'
import axios from 'axios'
import { showToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'

const UpdatePassword = ({email}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const formSchema = zSchema.pick({
        email:true,
      password:true
    }).extend({
      confirmPassword:z.string()
    }).refine((data) => data.password === data.confirmPassword,{
        message:'Password and confirm password must be same',
        path:['confirmPassword']
    })
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email:email,
        password: "",
        confirmPassword: "",
      },
    })
    
    const handlePasswordUpdate = async (values) => {
        try {
          setLoading(true)
          const {data: passwordUpdate} = await axios.put('/api/auth/reset-password/update-password', values)
          
          
          if(!passwordUpdate.success){
            throw new Error(passwordUpdate.message)
          }
          form.reset()
          showToast('success',passwordUpdate.message)
          router.push(WEBSITE_LOGIN)
        } catch (error) {
          showToast('error',error.message)
        } finally {
          setLoading(false)
        }
    }
    
    return (
      
        <div>
          <div className='text-center'>
            <h1 className="text-xl m-3 font-semibold">Update Password</h1>
            <p className='text-gray-400 text-sm'>Create your new password by filling out the form</p>
          </div>
          <div className='mt-3'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="mt-6">
                
                <div className='mb-6'>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-yellow-800">Password</FormLabel>
                        <FormControl>
                          <Input type={isTypePassword ? "password" : "text"} placeholder="Enter your password" {...field} />
                        </FormControl>
                        <button className='absolute top-1/2 right-2' type='button' onClick={() => setIsTypePassword(!isTypePassword)}>
                          {isTypePassword ?
                            <PiEyeClosedDuotone />
                            :
                            <FaEye />
                          }
                        </button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-6'>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-yellow-800">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type={isTypePassword ? "password" : "text"} placeholder="Enter your password" {...field} />
                        </FormControl>
                        <button className='absolute top-1/2 right-2' type='button' onClick={() => setIsTypePassword(!isTypePassword)}>
                          {isTypePassword ?
                            <PiEyeClosedDuotone />
                            :
                            <FaEye />
                          }
                        </button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <ButtonLoading loading={loading} type="Submit" text="Update Password" className="w-full cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
                </div>
                
              </form>
            </Form>
          </div>
        </div>
    )
}

export default UpdatePassword
