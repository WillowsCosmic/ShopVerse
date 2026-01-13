'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
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
import { z } from 'zod'
import Link from 'next/link'
import { WEBSITE_REGISTER } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/toast'
import OtpVerification from '@/components/Application/OtpVerification'

const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const formSchema = zSchema.pick({
        email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })
    const handleEmailVerification = async (values) => {

    }
    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)

            const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)


            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            setOtpEmail('')
            form.reset()
            showToast('success', otpResponse.message)

            dispatch(login(otpResponse.data))

        } catch (error) {

            showToast('error', error.message || 'Login failed')
        } finally {
            setOtpVerificationLoading(false)
        }
    }
    return (
        <Card className="w-112.5 bg-white/90 backdrop-blur-sm shadow-2xl border border-amber-100">
            <CardContent>
                <div className='flex justify-center'>
                    <Image src={Logo.src} alt="logo" width={Logo.width} height={Logo.height} className='max-w-38.5' />
                </div>

                {!otpEmail
                    ?
                    <>
                        <div className='text-center'>
                            <h1 className="text-xl m-3 font-semibold">Reset Password</h1>
                            <p className='text-gray-400 text-sm'>Enter your email for password reset</p>
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

                                    <div className="mb-3">
                                        <ButtonLoading loading={emailVerificationLoading} type="submit" text="Send OTP" className="w-full cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
                                    </div>
                                    <div className="text-center">
                                        <div className='flex justify-center items-center gap-1'>

                                            <Link href={WEBSITE_REGISTER} className='text-primary underline'>Back to login</Link>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                    :
                    <OtpVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                }

            </CardContent>
        </Card>
    )
}

export default ResetPassword