import { z } from 'zod';
import mongoose from 'mongoose';

const createLikeZodSchema = z.object({
  courseId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid course ID',
  }),
});

export { createLikeZodSchema };
