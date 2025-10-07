import Yup from 'yup';

import {
  abortMultipartSchema,
  abortSingleSchema,
  completeMultipartSchema,
  completeSingleUploadSchema,
  initiateMultipartSchema,
  multipartPartRequestSchema,
  presignedUploadSchema,
  putFileToS3Schema,
  singlePartSchema,
} from '@/services/upload/schema';

export type presignedUploadType = Yup.InferType<typeof presignedUploadSchema>;
export type initiateMultipartType = Yup.InferType<typeof initiateMultipartSchema>;
export type multipartPartRequestType = Yup.InferType<typeof multipartPartRequestSchema>;
export type singlePartType = Yup.InferType<typeof singlePartSchema>;
export type completeMultipartType = Yup.InferType<typeof completeMultipartSchema>;
export type abortMultipartType = Yup.InferType<typeof abortMultipartSchema>;
export type abortSingleType = Yup.InferType<typeof abortSingleSchema>;
export type completeSingleUploadType = Yup.InferType<typeof completeSingleUploadSchema>;
export type putFileToS3Type = Yup.InferType<typeof putFileToS3Schema>;
