import { array, date, number, object, ref, string } from 'yup';

export const loginSchema = object({
  email: string().email('Invalid email address').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
      'Password must include at least one lowercase letter, one uppercase letter, and one number'
    ),
});

export const loginResponseSchema = object({
  access_token: string().required(),
  refresh_token: string().required(),
  user: object({
    id: number().required(),
    email: string().required(),
    name: string().required(),
    roles: array().of(string().required()).required(),
  }).optional(),
});

export const errorResponse = object({
  statusCode: number().required(),
  timestamp: date().required(),
  path: string().required(),
  message: object({
    message: string().required(),
    error: string().required(),
    statusCode: number().required(),
  }).required(),
}).required();

export const resetPasswordSchema = object({
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const forgotPasswordSchema = object({
  email: string().email().required(),
});
