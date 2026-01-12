import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import ButtonLoading from './ButtonLoading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import axios from 'axios'
import { showToast } from '@/lib/toast'

const OtpVerification = ({ email, onSubmit, loading }) => {
    const formSchema = zSchema.pick({
        otp: true, email: true
    })
    const [isResendingOtp, setIsResendingOtp] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email
        }
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }
    
    const resendOtp = async () => {
        try {
          setIsResendingOtp(true)
         
          const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', {email})
          
          
          if (!resendOtpResponse.success) {
            throw new Error(resendOtpResponse.message)
          }
          
          showToast('success', resendOtpResponse.message)
      
        } catch (error) {
          
          showToast('error', error.message || 'Login failed')
        } finally {
          setIsResendingOtp(false)
        }
      }

    return (
        <div>
            <Form {...form}>

                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="mt-6">
                    <div className="text-center">
                        <h1 className='text-2xl font-bold mb-2'>Please complete verification</h1>
                        <p className='text-md text-gray-400'>We have sent an One-time Password (OTP) to your registered email</p>
                    </div>
                    <div className='mb-5 mt-5 flex justify-center'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-yellow-800">OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot className={'text-xl size-10'} index={0} />
                                                <InputOTPSlot className={'text-xl size-10'} index={1} />
                                                <InputOTPSlot className={'text-xl size-10'} index={2} />
                                                <InputOTPSlot className={'text-xl size-10'} index={3} />
                                                <InputOTPSlot className={'text-xl size-10'} index={4} />
                                                <InputOTPSlot className={'text-xl size-10'} index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mb-3">
                        <ButtonLoading loading={loading} type="submit" text="Verify" className="w-full cursor-pointer bg-linear-to-r hover:from-yellow-200 hover:to-amber-200 transition-all duration-200 from-amber-300 to-yellow-300" />
                        <div className='text-center mt-5'>
                            {!isResendingOtp? <button onClick={resendOtp} type='button' className='text-blue-500 cursor-pointer hover:text-blue-400 hover:underline'>Resend OTP</button>:<span className='text-md'>Resending...</span>}
                           
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OtpVerification