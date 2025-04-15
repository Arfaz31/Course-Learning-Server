import { z } from 'zod';

export const CreateEnrollmentValidationSchema = z.object({
  body: z.object({
    course: z.string({
      required_error: 'Course ID is required',
    }),
  }),
});

export const UpdateEnrollmentValidationSchema = z.object({
  body: z.object({
    status: z
      .enum(['active', 'pending', 'completed', 'cancelled'], {
        invalid_type_error:
          'Status must be one of: active, pending, completed, cancelled',
      })
      .optional(),
  }),
});

export const UpdateProgressValidationSchema = z.object({
  completedLessons: z.array(z.string()).optional(),
  completedTopics: z.array(z.string()).optional(),
});

export const MarkTopicCompletedValidationSchema = z.object({
  body: z.object({
    topicId: z.string({
      required_error: 'Topic ID is required',
    }),
  }),
});
