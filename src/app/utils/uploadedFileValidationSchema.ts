import { z } from 'zod';

const maxUploadSize = 100 * 1024 * 1024; // 100MB

const acceptedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/ogg',
] as const;

const UploadedFileZodSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(acceptedFileTypes),
  path: z.string(),
  size: z
    .number()
    .refine(
      (size) => size <= maxUploadSize,
      'File size must be less than 100 MB',
    ),
  filename: z.string(),
});

export const UploadedFilesArrayZodSchema = z.object({
  files: z
    .record(z.string(), z.array(UploadedFileZodSchema))
    .refine(
      (files) => Object.keys(files).length > 0,
      'At least one file must be uploaded',
    )
    .optional(), // Mark files as optional in case you want image-only or video-only support
});
