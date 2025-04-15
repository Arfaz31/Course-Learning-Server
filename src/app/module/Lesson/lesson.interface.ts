import { Types } from 'mongoose';

export type TLesson = {
  title: string;
  description: string;
  course: Types.ObjectId;
  duration: number; // in minutes
  order?: number;
  isPublished: boolean;
  videoUrl?: string;
  resources?: string[];
  topics: Types.ObjectId[];
};

export type TUpdateLesson = {
  title?: string;
  description?: string;
  duration?: number;
  isPublished?: boolean;
  videoUrl?: string;
  resources?: string[];
};
