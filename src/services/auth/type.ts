import Yup from 'yup';

import { errorResponse, loginResponseSchema, loginSchema } from '@/services/auth/schema';

export type LoginResponse = Yup.InferType<typeof loginResponseSchema>;
export type Credential = Yup.InferType<typeof loginSchema>;
export type ErrorResponse = Yup.InferType<typeof errorResponse>;
