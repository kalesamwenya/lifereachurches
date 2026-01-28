/**
 * Common Validation Schemas
 * Reusable Zod schemas for form validation
 */

import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

// Phone validation (Zambian format)
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Contact Form Schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

// Giving Form Schema
export const givingFormSchema = z.object({
  name: nameSchema,
  contact: z.string().min(6, 'Contact must be at least 6 characters'),
  category: z.enum(['tithe', 'offering', 'seed', 'partnership', 'missions'], {
    required_error: 'Please select a giving category',
  }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  method: z.enum(['mobile_money', 'card'], {
    required_error: 'Please select a payment method',
  }),
  momo_number: z.string().optional(),
  network: z.enum(['MTN', 'Airtel', 'Zamtel']).optional(),
});

// Event Registration Schema
export const eventRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  attendees: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10, {
      message: 'Attendees must be between 1 and 10',
    }),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
});

// Testimony Submission Schema
export const testimonySchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  category: z.enum(['healing', 'provision', 'salvation', 'breakthrough', 'other']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  testimony: z
    .string()
    .min(50, 'Testimony must be at least 50 characters')
    .max(2000, 'Testimony must be less than 2000 characters'),
  allowPublish: z.boolean(),
});

// Volunteer Application Schema
export const volunteerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 16 && Number(val) <= 100, {
      message: 'Age must be between 16 and 100',
    }),
  interests: z.array(z.string()).min(1, 'Please select at least one area of interest'),
  experience: z.string().max(1000).optional(),
  availability: z.array(z.string()).min(1, 'Please select your availability'),
});

// Auth Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  address: z.string().max(200).optional(),
});

export default {
  emailSchema,
  phoneSchema,
  nameSchema,
  passwordSchema,
  contactFormSchema,
  givingFormSchema,
  eventRegistrationSchema,
  testimonySchema,
  volunteerSchema,
  loginSchema,
  registerSchema,
  profileUpdateSchema,
};
