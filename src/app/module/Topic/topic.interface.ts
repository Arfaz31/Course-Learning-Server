import { Types } from 'mongoose';

export enum TOPIC_TYPE {
  CONTENT = 'content',
  QUIZ = 'quiz',
}

export type TQuizOption = {
  text: string;
  isCorrect: boolean;
};

export type TQuizQuestion = {
  question: string;
  options: TQuizOption[];
};

export type TTopic = {
  id?: string;
  title: string;
  lesson: Types.ObjectId;
  order: number; // To maintain the order of topics in a lesson
  type: keyof typeof TOPIC_TYPE;
  content?: string;
  quizQuestions?: TQuizQuestion[];
  isDeleted: boolean;
};
