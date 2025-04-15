import { z } from 'zod';

export const UpdateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
