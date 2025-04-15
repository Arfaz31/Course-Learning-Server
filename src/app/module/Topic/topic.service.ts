import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Course } from '../Course/course.model';
import { Lesson } from '../Lesson/lesson.model';
import { TOPIC_TYPE, TTopic } from './topic.interface';
import { Topic } from './topic.model';
import QueryBuilder from '../../Builder/QueryBuilder';
import { topicSearchableFields } from './topic.constant';
import AppError from '../../Error/AppError';
import mongoose from 'mongoose';

const createTopic = async (payload: TTopic, user: JwtPayload) => {
  const lesson = await Lesson.findById(payload.lesson);
  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Find the course to check if the user is authorized
  const course = await Course.findById(lesson.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the user is the teacher of this course
  if (course.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to add topics to this lesson',
    );
  }

  // Validate based on topic type
  if (payload.type === (TOPIC_TYPE.CONTENT as string) && !payload.content) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Content is required for content type topics',
    );
  }

  if (
    payload.type === (TOPIC_TYPE.QUIZ as string) &&
    (!payload.quizQuestions || payload.quizQuestions.length === 0)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Quiz questions are required for quiz type topics',
    );
  }

  const lastTopic = await Topic.findOne({
    lesson: payload.lesson,
    isDeleted: false,
  })
    .sort({ order: -1 })
    .limit(1);

  payload.order = lastTopic ? (lastTopic.order || 0) + 1 : 1;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the topic
    const topic = await Topic.create([payload], { session });

    // Add the topic to the lesson's topics array
    await Lesson.findByIdAndUpdate(
      payload.lesson,
      { $push: { topics: topic[0]._id } },
      { session },
    );

    await session.commitTransaction();
    return topic[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllTopics = async (query: Record<string, unknown>) => {
  const topicQuery = new QueryBuilder(
    Topic.find().populate('lesson', '_id title'),
    query,
  )
    .search(topicSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await topicQuery.modelQuery;
  const meta = await topicQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getTopicsByLesson = async (lessonId: string) => {
  const topics = await Topic.find({ lesson: lessonId, isDeleted: false }).sort({
    order: 1,
  });

  return topics;
};

const getSingleTopic = async (id: string) => {
  const topic = await Topic.findOne({ _id: id, isDeleted: false }).populate(
    'lesson',
    '_id title',
  );

  if (!topic) {
    throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
  }

  return topic;
};

const updateTopic = async (
  id: string,
  payload: Partial<TTopic>,
  user: JwtPayload,
) => {
  const topic = await Topic.findOne({ _id: id, isDeleted: false });
  if (!topic) {
    throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
  }

  const lesson = await Lesson.findById(topic.lesson);
  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  const course = await Course.findById(lesson.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (course.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update topics for this lesson',
    );
  }

  // Validate type-specific fields
  if (payload.type === (TOPIC_TYPE.CONTENT as string)) {
    // If changing type to CONTENT, content must be provided
    if (topic.type !== (TOPIC_TYPE.CONTENT as string) && !payload.content) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Content is required when changing type to content',
      );
    }
  } else if (payload.type === (TOPIC_TYPE.QUIZ as string)) {
    // If changing type to QUIZ, quizQuestions must be provided
    if (
      topic.type !== (TOPIC_TYPE.QUIZ as string) &&
      (!payload.quizQuestions || payload.quizQuestions.length === 0)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Quiz questions are required when changing type to quiz',
      );
    }
  }

  const result = await Topic.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteTopic = async (id: string, user: JwtPayload) => {
  const topic = await Topic.findOne({ _id: id, isDeleted: false });
  if (!topic) {
    throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
  }

  const lesson = await Lesson.findById(topic.lesson);
  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  const course = await Course.findById(lesson.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the user is the teacher of this course
  if (course.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete topics for this lesson',
    );
  }

  // Soft delete the topic
  const result = await Topic.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  // Reorder remaining topics
  await Topic.updateMany(
    {
      lesson: topic.lesson,
      order: { $gt: topic.order! },
      isDeleted: false,
    },
    { $inc: { order: -1 } },
  );

  return result;
};

export const TopicService = {
  createTopic,
  getAllTopics,
  getTopicsByLesson,
  getSingleTopic,
  updateTopic,
  deleteTopic,
};
