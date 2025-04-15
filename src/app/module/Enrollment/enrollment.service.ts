/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Course } from '../Course/course.model';
import { Lesson } from '../Lesson/lesson.model';
import { Topic } from '../Topic/topic.model';
import { TEnrollment } from './enrollment.interface';
import { Enrollment } from './enrollment.model';
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';

const enrollInCourse = async (payload: TEnrollment, user: JwtPayload) => {
  // Check if the course exists
  const course = await Course.findById(payload.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the course is published
  if (!course.isPublished) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot enroll in an unpublished course',
    );
  }

  // Create enrollment
  const enrollmentData: TEnrollment = {
    student: user.id,
    course: payload.course,
    status: 'active',
    enrolledAt: new Date(),
    progress: {
      completedLessons: [],
      completedTopics: [],
    },
  };

  const result = await Enrollment.create(enrollmentData);
  return result;
};

// Get all enrollments with filters
const getAllEnrollments = async (query: Record<string, unknown>) => {
  const enrollmentQuery = new QueryBuilder(
    Enrollment.find()
      .populate({
        path: 'student',
        select: 'name email role',
      })
      .populate({
        path: 'course',
        select: '_id title description thumbnail duration level',
        populate: [
          {
            path: 'teacher',
            select: 'name email role',
          },
          {
            path: 'lessons',
            select: 'title description duration order',
            populate: {
              path: 'topics',
              select: 'title type order',
            },
          },
        ],
      })
      .populate('progress.completedLessons')
      .populate('progress.completedTopics'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrollmentQuery.modelQuery;
  const meta = await enrollmentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Get user's enrollments (for students to see their courses)
const getMyEnrollments = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const enrollmentQuery = new QueryBuilder(
    Enrollment.find({ student: user.id })
      .populate({
        path: 'course',
        select: '_id title description thumbnail duration level',
        populate: [
          {
            path: 'teacher',
            select: 'name email role',
          },
          {
            path: 'lessons',
            select: '_id title description duration order videoUrl resources',
            populate: {
              path: 'topics',
              select: '_id title type order content, quizQuestions',
            },
          },
        ],
      })
      .populate('progress.completedLessons')
      .populate('progress.completedTopics'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrollmentQuery.modelQuery;
  const meta = await enrollmentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Get enrollment details for a specific course
const getMyCourseEnrollment = async (courseId: string, user: JwtPayload) => {
  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Find enrollment
  const enrollment = await Enrollment.findOne({
    student: user.id,
    course: courseId,
  })
    .populate({
      path: 'student',
      select: 'name email role',
    })
    .populate({
      path: 'course',
      select: '_id title description thumbnail duration level',
      populate: [
        {
          path: 'teacher',
          select: 'name email role',
        },
        {
          path: 'lessons',
          select: '_id title description duration order videoUrl resources',
          populate: {
            path: 'topics',
            select: '_id title type order content, quizQuestions',
          },
        },
      ],
    })
    .populate('progress.completedLessons')
    .populate('progress.completedTopics');

  if (!enrollment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not enrolled in this course',
    );
  }

  if (enrollment.status === 'cancelled') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your enrollment has been cancelled',
    );
  }

  // Progress calculation
  const courseData = enrollment.course as any;

  const completedLessonIds = (enrollment.progress?.completedLessons || []).map(
    (l: any) => l._id.toString(),
  );
  const completedTopicIds = (enrollment.progress?.completedTopics || []).map(
    (t: any) => t._id.toString(),
  );

  let totalTopics = 0;
  let completedTopics = 0;

  let totalLessons = 0;
  let completedLessons = 0;

  if (courseData.lessons && courseData.lessons.length > 0) {
    totalLessons = courseData.lessons.length;

    courseData.lessons.forEach((lesson: any) => {
      const lessonId = lesson._id.toString();
      if (completedLessonIds.includes(lessonId)) {
        completedLessons++;
      }

      if (lesson.topics && lesson.topics.length > 0) {
        totalTopics += lesson.topics.length;

        lesson.topics.forEach((topic: any) => {
          const topicId = topic._id.toString();
          if (completedTopicIds.includes(topicId)) {
            completedTopics++;
          }
        });
      }
    });
  }

  // Calculate percentage based on topics only
  // const topicProgressPercentage =
  //   totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Optionally: use combined metric (lessons + topics)
  const totalItems = totalLessons + totalTopics;
  const completedItems = completedLessons + completedTopics;

  const overallProgressPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Update enrollment progressPercentage
  enrollment.progressPercentage = overallProgressPercentage;
  await enrollment.save();

  return enrollment;
};

// Mark a topic as completed
const markTopicCompleted = async (
  courseId: string,
  topicId: string,
  user: JwtPayload,
) => {
  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the topic exists
  const topic = await Topic.findOne({ _id: topicId, isDeleted: false });
  if (!topic) {
    throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
  }

  // Check if the topic belongs to a lesson in this course
  const lesson = await Lesson.findById(topic.lesson);
  if (!lesson || lesson.course.toString() !== courseId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Topic does not belong to this course',
    );
  }

  // Find user's enrollment
  const enrollment = await Enrollment.findOne({
    student: user.id,
    course: courseId,
    status: 'active',
  });

  if (!enrollment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not enrolled in this course',
    );
  }

  // Check if topic is already marked as completed
  if (
    enrollment.progress?.completedTopics?.some(
      (id) => id.toString() === topicId,
    )
  ) {
    // Already completed, no need to update
    return enrollment;
  }

  // Add topic to completed topics
  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollment._id,
    {
      $addToSet: { 'progress.completedTopics': topicId },
    },
    { new: true },
  );

  // Check if all topics in the lesson are completed
  const lessonTopics = await Topic.find({
    lesson: lesson._id,
    isDeleted: false,
  });

  const completedTopicsInLesson = lessonTopics.filter((t) =>
    updatedEnrollment!.progress?.completedTopics?.some(
      (id) => id.toString() === t._id.toString(),
    ),
  );

  // If all topics are completed, mark the lesson as completed too
  if (completedTopicsInLesson.length === lessonTopics.length) {
    await Enrollment.findByIdAndUpdate(
      enrollment._id,
      {
        $addToSet: { 'progress.completedLessons': lesson._id },
      },
      { new: true },
    );
  }

  // Check if all lessons in the course are completed
  const allLessons = await Lesson.find({
    course: courseId,
    isDeleted: false,
  });

  const completedLessons = allLessons.filter((l) =>
    updatedEnrollment!.progress?.completedLessons?.some(
      (id) => id.toString() === l._id.toString(),
    ),
  );

  // If all lessons are completed, mark the course as completed
  if (completedLessons.length === allLessons.length) {
    await Enrollment.findByIdAndUpdate(
      enrollment._id,
      {
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true },
    );
  }

  return updatedEnrollment;
};

// Admin functions to manage enrollments
const updateEnrollmentStatus = async (
  id: string,
  payload: { status: TEnrollment['status'] },
) => {
  // Check if the enrollment exists
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Update the enrollment
  const result = await Enrollment.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  );

  return result;
};

// Get course analytics for teacher (number of enrollments, completion rate, etc.)
const getCourseEnrollmentAnalytics = async (
  courseId: string,
  user: JwtPayload,
) => {
  // Check if the course exists and belongs to the teacher
  const course = await Course.findOne({ _id: courseId, teacher: user.id });
  if (!course) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Course not found or you are not authorized',
    );
  }

  // Get all enrollments for this course
  const enrollments = await Enrollment.find({ course: courseId })
    .populate({
      path: 'student',
      select: 'name email role',
    })
    .populate({
      path: 'course',
      select: '_id title description thumbnail duration level',
    });

  // Calculate analytics
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter(
    (e) => e.status === 'active',
  ).length;
  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'completed',
  ).length;
  const cancelledEnrollments = enrollments.filter(
    (e) => e.status === 'cancelled',
  ).length;

  // Calculate completion rate
  const completionRate =
    totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

  return {
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    cancelledEnrollments,
    completionRate: Math.round(completionRate),
  };
};

export const EnrollmentService = {
  enrollInCourse,
  getAllEnrollments,
  getMyEnrollments,
  getMyCourseEnrollment,
  markTopicCompleted,
  updateEnrollmentStatus,
  getCourseEnrollmentAnalytics,
};
