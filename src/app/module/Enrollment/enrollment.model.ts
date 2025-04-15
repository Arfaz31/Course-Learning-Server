import { Schema, model } from 'mongoose';
import { TEnrollment } from './enrollment.interface';

const enrollmentSchema = new Schema<TEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'pending', 'cancelled'],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    progress: {
      completedLessons: {
        type: [Schema.Types.ObjectId],
        ref: 'Lesson',
        default: [],
      },
      completedTopics: {
        type: [Schema.Types.ObjectId],
        ref: 'Topic',
        default: [],
      },
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Enrollment = model<TEnrollment>('Enrollment', enrollmentSchema);
