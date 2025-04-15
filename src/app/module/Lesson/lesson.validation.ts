import { z } from 'zod';

export const CreateLessonValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    course: z.string({
      required_error: 'Course ID is required',
    }),
    duration: z.number({
      required_error: 'Duration in minutes is required',
    }),
    order: z.number().optional(),
    isPublished: z.boolean().optional(),
    videoUrl: z.string().optional(),
    resources: z.array(z.string()).optional(),
  }),
});

export const UpdateLessonValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.number().optional(),
    isPublished: z.boolean().optional(),
    videoUrl: z.string().optional(),
    resources: z.array(z.string()).optional(),
  }),
});
