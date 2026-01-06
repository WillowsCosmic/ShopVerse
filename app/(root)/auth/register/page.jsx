
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ButtonLoading from '@/components/Application/ButtonLoading'
import { z } from 'zod'
import Link from 'next/link'
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/toast'

const RegisterPage = () => {
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const formSchema = zSchema.pick({
      name:true,
      email: true,
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
        name:"",
        email: "",
        password: "",
        confirmPassword: "",
      },
    })
    
    const handleRegisterSubmit = async (values) => {
        try {
          setLoading(true)
          const {data: registerResponse} = await axios.post('/api/auth/register', values)
          
          
          if(!registerResponse.success){
            throw new Error(registerResponse.message)
          }
          form.reset()
          showToast('success',registerResponse.message)
          
        } catch (error) {
          showToast('error',registerResponse.message)
        } finally {
          setLoading(false)
        }
    }
    
    return (
      <Card className="w-112.5 bg-white/90 backdrop-blur-sm shadow-2xl border border-amber-100">
        <CardContent>
          <div className='flex justify-center'>
            <Image src={Logo.src} alt="logo" width={Logo.width} height={Logo.height} className='max-w-38.5' />
          </div>
          <div className='text-center'>
            <h1 className="text-xl m-3 font-semibold">Create an Account</h1>
            <p className='text-gray-400 text-sm'>Create your new account by filling out the form</p>
          </div>
          <div className='mt-3'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="mt-6">
                <div className='mb-5'>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-800">Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-5'>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-800">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  <ButtonLoading loading={loading} type="Submit" text="Create an Account" className="w-full cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
                </div>
                <div className="text-center">
                  <div className='flex justify-center items-center gap-1'>
                    <p>Already have an account?</p>
                    <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login!</Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    )
}

export default RegisterPage
