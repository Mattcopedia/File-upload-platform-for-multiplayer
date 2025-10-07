import { array, number, object, string } from 'yup';

export const paginationSchema = object().shape({
  totalItems: number().required(),
  itemCount: number().required(),
  itemsPerPage: number().required(),
  totalPages: number().required(),
  currentPage: number().required(),
});

export const fileSchema = object().shape({
  id: string().uuid().required(),
  filename: string().required(),
  mimetype: string().required(),
  multipartUploadId: string().nullable(),
  status: string().required(),
  pageCount: number().optional(),
  user: object().shape({
    id: string().uuid().required(),
    firstName: string().required(),
    lastName: string().required(),
  }),
  createdAt: string().required(),
  size: number().required(),
  lastModified: string().required(),
  url: string().url().required(),
});

export const filesResponseSchema = object({
  items: array().of(fileSchema).required(),
  meta: paginationSchema.required(),
});
