import { Types } from 'mongoose';

export type TEnrollmentStatus =
  | 'active'
  | 'pending'
  | 'completed'
  | 'cancelled';

export type TEnrollment = {
  student: Types.ObjectId;
  course: Types.ObjectId;
  status: TEnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  progress?: {
    completedLessons?: Types.ObjectId[];
    completedTopics?: Types.ObjectId[];
  };
  progressPercentage?: number;
};
