import {z} from 'zod'

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

export const zSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})