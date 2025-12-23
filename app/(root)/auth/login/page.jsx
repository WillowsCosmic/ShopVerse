'use client'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'

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

const Login = () => {

  const formSchema = zSchema.pick({
    email: true,
    password: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const handleLoginSubmit = async (value) => {

  }
  return (
    <Card className="w-112.5 bg-white/90 backdrop-blur-sm shadow-2xl border border-amber-100">
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} alt="logo" width={Logo.width} height={Logo.height} className='max-w-38.5' />
        </div>
        <div className='text-center'>
          <h1 className="text-xl m-3 font-semibold">Login Into Account</h1>
          <p className='text-gray-400 text-sm'>Login into your account by filling out the form</p>
        </div>
        <div className='mt-3'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="mt-6">
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-800">Username</FormLabel>
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
                    <FormItem>
                      <FormLabel className="text-yellow-800">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <ButtonLoading type="Submit" text="Login" className="w-full bg-linear-to-r hover:from-yellow-200 hover:to-amber-300 from-amber-400 to-yellow-500"/>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default Login