import { Schema, model } from 'mongoose';
import { TLesson } from './lesson.interface';

const lessonSchema = new Schema<TLesson>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    videoUrl: {
      type: String,
    },
    resources: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Lesson = model<TLesson>('Lesson', lessonSchema);
