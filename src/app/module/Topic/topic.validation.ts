import { z } from 'zod';
import { TOPIC_TYPE } from './topic.interface';

// Quiz option validation schema
const QuizOptionValidationSchema = z.object({
  text: z.string({
    required_error: 'Option text is required',
  }),
  isCorrect: z.boolean({
    required_error: 'isCorrect flag is required',
  }),
});

// Quiz question validation schema
const QuizQuestionValidationSchema = z.object({
  question: z.string({
    required_error: 'Question text is required',
  }),
  options: z.array(QuizOptionValidationSchema).min(2, {
    message: 'At least 2 options are required for a quiz question',
  }),
});

// Create topic validation schema
export const CreateTopicValidationSchema = z.object({
  body: z
    .object({
      title: z.string({
        required_error: 'Title is required',
      }),
      lesson: z.string({
        required_error: 'Lesson ID is required',
      }),
      order: z.number().optional(),
      type: z.enum([TOPIC_TYPE.CONTENT, TOPIC_TYPE.QUIZ], {
        required_error: 'Topic type is required',
      }),
      content: z.string().optional(),
      quizQuestions: z.array(QuizQuestionValidationSchema).optional(),
    })
    .refine(
      (data) => {
        // If type is 'content', content should be provided
        if (data.type === TOPIC_TYPE.CONTENT && !data.content) {
          return false;
        }
        // If type is 'quiz', quizQuestions should be provided
        if (
          data.type === TOPIC_TYPE.QUIZ &&
          (!data.quizQuestions || data.quizQuestions.length === 0)
        ) {
          return false;
        }
        return true;
      },
      {
        message:
          'Content is required for content type topics, and quiz questions are required for quiz type topics',
        path: ['content', 'quizQuestions'],
      },
    ),
});

export const UpdateTopicValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    order: z.number().optional(),
    type: z.enum([TOPIC_TYPE.CONTENT, TOPIC_TYPE.QUIZ]).optional(),
    content: z.string().optional(),
    quizQuestions: z.array(QuizQuestionValidationSchema).optional(),
  }),
});
