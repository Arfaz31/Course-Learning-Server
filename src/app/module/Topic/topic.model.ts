// module/Topic/topic.model.ts
import { Schema, model } from 'mongoose';
import { TOPIC_TYPE, TTopic } from './topic.interface';

// Define schema for quiz options
const quizOptionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

// Define schema for quiz questions
const quizQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [quizOptionSchema],
});

const topicSchema = new Schema<TTopic>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TOPIC_TYPE),
      required: true,
    },
    content: {
      type: String,
    },
    quizQuestions: {
      type: [quizQuestionSchema],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Topic = model<TTopic>('Topic', topicSchema);
