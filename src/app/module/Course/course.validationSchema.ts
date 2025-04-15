import { z } from 'zod';

export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Course title is required' }).trim(),
    description: z.string({ required_error: 'Course description is required' }),
    teacher: z.string({ required_error: 'Teacher ID is required' }),
    price: z.number().nonnegative().optional(),
    isFree: z.boolean({ required_error: 'isFree is required' }),
    category: z.string({ required_error: 'Category is required' }),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      required_error: 'Level is required',
    }),
    duration: z.number({ required_error: 'Duration is required' }).positive(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().optional(),
    teacher: z.string().optional(),
    price: z.number().nonnegative().optional(),
    isFree: z.boolean().optional(),
    category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    duration: z.number().positive().optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
