import httpStatus from 'http-status';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TopicService } from './topic.service';

const createTopic = CatchAsync(async (req, res) => {
  const result = await TopicService.createTopic(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Topic created successfully',
    data: result,
  });
});

const getAllTopics = CatchAsync(async (req, res) => {
  const result = await TopicService.getAllTopics(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topics retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getTopicsByLesson = CatchAsync(async (req, res) => {
  const { lessonId } = req.params;
  const result = await TopicService.getTopicsByLesson(lessonId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topics retrieved successfully',
    data: result,
  });
});

const getSingleTopic = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TopicService.getSingleTopic(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topic retrieved successfully',
    data: result,
  });
});

const updateTopic = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TopicService.updateTopic(id, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topic updated successfully',
    data: result,
  });
});

const deleteTopic = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TopicService.deleteTopic(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topic deleted successfully',
    data: result,
  });
});

export const TopicController = {
  createTopic,
  getAllTopics,
  getTopicsByLesson,
  getSingleTopic,
  updateTopic,
  deleteTopic,
};
