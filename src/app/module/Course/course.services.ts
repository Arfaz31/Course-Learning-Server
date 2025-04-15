import { Course } from './course.model';
import { TCourse } from './course.interface';
import QueryBuilder from '../../Builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TImageFile } from '../../interface/image.interface';

const createCourse = async (payload: TCourse, thumbnail: TImageFile) => {
  if (thumbnail) {
    payload.thumbnail = thumbnail.path;
  }
  const result = await Course.create(payload);
  return result;
};

const getAllCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find()
      .populate('teacher', '_id name email profileImg')
      .populate({
        path: 'feedback',
        populate: {
          path: 'user',
          select: '_id name email profileImg',
        },
      })
      .populate('like', '_id name email profileImg')
      .populate({
        path: 'lessons',
        populate: {
          path: 'topics',
          select: 'title type order content quizQuestions',
        },
      }),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  return { result, meta };
};

const getSingleCourse = async (id: string) => {
  const result = await Course.findById(id)
    .populate('teacher', '_id name email profileImg')
    .populate({
      path: 'feedback',
      populate: {
        path: 'user',
        select: '_id name email profileImg',
      },
    })
    .populate('like', '_id name email profileImg')
    .populate({
      path: 'lessons',
      populate: {
        path: 'topics',
        select: 'title type order content quizQuestions',
      },
    });
  return result;
};

const updateCourse = async (
  id: string,
  payload: Partial<TCourse>,
  thumbnail?: TImageFile,
) => {
  if (thumbnail) {
    payload.thumbnail = thumbnail.path;
  }
  const result = await Course.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCourse = async (id: string) => {
  const result = await Course.findByIdAndDelete(id);
  return result;
};

const getTeacherCourses = async (teacherId: string) => {
  const result = await Course.find({ teacher: teacherId })
    .populate({
      path: 'feedback',
      populate: {
        path: 'user',
        select: '_id name email profileImg',
      },
    })
    .populate('like', '_id name email profileImg')
    .populate({
      path: 'lessons',
      populate: {
        path: 'topics',
        select: 'title type order content quizQuestions',
      },
    });
  return result;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
};
