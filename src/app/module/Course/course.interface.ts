import { Types } from 'mongoose';

export type TCourse = {
  title: string;
  description: string;
  teacher: Types.ObjectId;
  thumbnail?: string;
  price?: number;
  isFree: boolean;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  isPublished: boolean;
  publishedAt?: string;
  tags?: string[];
  feedback: Types.ObjectId[]; //by enrolled students
  like: Types.ObjectId[]; //by students
};
