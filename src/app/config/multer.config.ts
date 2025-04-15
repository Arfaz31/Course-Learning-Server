import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import multer from 'multer';

const removeExtension = (fileName: string) => {
  return fileName.split('.').slice(0, -1).join('.');
};

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: {
//     public_id: (_req, file) =>
//       Math.random().toString(36).substring(2) +
//       '-' +
//       Date.now() +
//       '-' +
//       file.fieldname +
//       '-' +
//       removeExtension(file.originalname),

//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (_req, file) => {
    return {
      public_id:
        Math.random().toString(36).substring(2) +
        '-' +
        Date.now() +
        '-' +
        file.fieldname +
        '-' +
        removeExtension(file.originalname),
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export const uploadSingleImage = upload.fields([
  { name: 'image', maxCount: 1 },
]);

export const uploadSingleVideo = upload.fields([
  { name: 'video', maxCount: 1 },
]);

export const uploadImageAndVideo = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

export const uploadMultipleImages = (
  fields: { name: string; maxCount: number }[],
) => {
  return upload.fields(fields);
};
