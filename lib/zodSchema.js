import { z } from 'zod'

const nameSchema = z
  .string()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(50, { message: "Name must not exceed 50 characters" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  email:z.email()
});

export const zSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  otp: z.string().length(6, "OTP must be 6 digits")
})