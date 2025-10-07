import Yup from 'yup';

import { fileSchema, filesResponseSchema } from '@/services/files/schema';
export type FilesResponse = Yup.InferType<typeof filesResponseSchema>;
export type FilesDetails = Yup.InferType<typeof fileSchema>;
