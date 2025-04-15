import { model, Schema } from 'mongoose';
import { TCourse } from './course.interface';

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    feedback: {
      type: [Schema.Types.ObjectId],
      ref: 'Feedback',
      default: [],
    },
    like: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lessons: {
      type: [Schema.Types.ObjectId],
      ref: 'Lesson',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Course = model<TCourse>('Course', courseSchema);
