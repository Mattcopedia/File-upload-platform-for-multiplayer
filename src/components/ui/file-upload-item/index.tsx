import { Box, Button, FormHelperText, LinearProgress, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import CancelIcon from '@/assets/icons/cancel.svg';
import DeleteIcon from '@/assets/icons/delete-file.svg';
import FileIcon from '@/assets/icons/file.svg';
import theme from '@/assets/styles/theme';
import styles from '@/components/ui/file-upload-item/index.module.css';
import { AllowedMimeTypesEnum, isAllowedFileType, SINGLE_UPLOAD_THRESHOLD } from '@/constants';
import { useUploadFilesContext } from '@/context/UploadFilesContext';
import { UploadingFile } from '@/hooks/useUploadingFiles';
import { isValidBaseFileNameSchema } from '@/services/upload/schema';
import {
  getBaseFileName,
  isValidFileName,
  validateNamingConventionParts,
} from '@/utils/file-validation';
import { userData } from '@/utils/generate-unique-id';

const FileUploadItem = ({
  file,
  setUploadingFiles,
}: {
  file: UploadingFile;
  setUploadingFiles: React.Dispatch<React.SetStateAction<UploadingFile[]>>;
}) => {
  const { uploadSingleFile, uploadMultipartFile, abortUpload } = useUploadFilesContext();
  const { data: session } = useSession();
  const user = session?.user;

  const originalName = file.file.name;
  const lastDotIndex = originalName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? originalName.slice(lastDotIndex) : '';
  const todayDate = dayjs().format('YYYYMMDD');
  const uniqueFileId = file.uniqueFileId;
  const facilityNameDisplay = `${userData(user?.facility?.name)}`;
  const fileName = getBaseFileName(originalName);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldTouched(e.target.name, true, false);
    formik.handleChange(e);
  };

  const uploadMutation = useMutation({
    mutationFn: async (f: UploadingFile) => {
      if (f.aborted) {
        throw new Error('aborted');
      }
      if (f.file.size < SINGLE_UPLOAD_THRESHOLD) {
        return uploadSingleFile(f);
      } else {
        return uploadMultipartFile(f);
      }
    },
    onSuccess: (updatedFile) => {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === updatedFile.id ? { ...updatedFile } : f))
      );
      toast.success(`${updatedFile.file.name} uploaded successfully`);
    },
    onError: (error: Error, failedFile) => {
      if (error instanceof Error && error.message === 'aborted') {
        return;
      }
      if (failedFile?.aborted) {
        return;
      }

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === failedFile.id ? { ...f, error: error.message || 'Upload failed' } : f
        )
      );
      toast.error('Upload failed');
    },
  });

  const handleRetryUpload = (file: UploadingFile) => {
    const baseName = formik.values.initialFinalName;
    const facilityName = `${userData(user?.facility?.name)}`;

    const error = validateNamingConventionParts(
      baseName,
      uniqueFileId,
      facilityName,
      todayDate,
      extension
    );

    if (error) {
      toast.error(error);
      return;
    }

    const finalNameConventionString = `${baseName}_${uniqueFileId}_${facilityName}_${todayDate}${extension}`;
    const retryName = finalNameConventionString;

    if (!isValidFileName(retryName)) {
      toast.error('Filename must follow format: FileName_UniqueIDNumber_HospitalName_YYYYMMDD');
      return;
    }

    if (!isAllowedFileType(file.file.type)) {
      toast.error(
        `File type not allowed. Must be one of: ${Object.values(AllowedMimeTypesEnum).join(', ')}`
      );
      return;
    }

    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, progress: 0, error: undefined, aborted: undefined } : f
      )
    );
    uploadMutation.reset();
    uploadMutation.mutate({
      ...file,
      name: finalNameConventionString,
    });
  };

  const formik = useFormik({
    initialValues: { initialFinalName: fileName },
    validationSchema: isValidBaseFileNameSchema,
    onSubmit: (values, { setSubmitting }) => {
      const facilityName = `${userData(user?.facility?.name)}`;
      const error = validateNamingConventionParts(
        values.initialFinalName,
        uniqueFileId,
        facilityName,
        todayDate,
        extension
      );

      if (error) {
        formik.setFieldError('initialFinalName', error);
        setSubmitting(false);
        return;
      }

      const finalNameConventionString = `${values.initialFinalName}_${uniqueFileId}_${facilityName}_${todayDate}${extension}`;
      if (!isAllowedFileType(file.file.type)) {
        formik.setFieldError(
          'initialFinalName',
          `File type not allowed. Must be one of: ${Object.values(AllowedMimeTypesEnum).join(', ')}`
        );
        setSubmitting(false);
        return;
      }

      if (!isValidFileName(finalNameConventionString)) {
        formik.setFieldError(
          'initialFinalName',
          'Filename must follow format: FileName_UniqueIDNumber_HospitalName_YYYYMMDD'
        );
        setSubmitting(false);
        return;
      }

      uploadMutation.mutate({
        ...file,
        name: finalNameConventionString,
      });
      setSubmitting(false);
    },
  });

  const isAborted = !!file.aborted;

  const isUploading =
    (file.progress ?? 0) > 0 && (file.progress ?? 0) < 100 && !file.error && !isAborted;

  const isCompleted = (file.progress ?? 0) === 100 && !file.error;

  const isInitialPhase = !isUploading && !isCompleted && !isAborted && file.progress === undefined;

  const showDelete = isCompleted || (!!file.error && isAborted);

  const showError =
    formik.touched.initialFinalName &&
    Boolean(formik.errors.initialFinalName) &&
    !formik.isSubmitting &&
    !uploadMutation.isPending;

  const showPreview =
    !showError &&
    formik.values.initialFinalName !== '' &&
    !formik.isSubmitting &&
    !uploadMutation.isPending;

  return (
    <Box key={file.id} className={styles.upload_item}>
      <Box display='flex' flexDirection='row' justifyContent='space-between' gap={2}>
        <Box display='flex' flexDirection='row' gap={1}>
          <FileIcon />
          <Box display='flex' flexDirection='column' gap={1}>
            {file.error && file.aborted && (
              <Typography color='error' fontSize={18} fontWeight={500}>
                {file.error}
              </Typography>
            )}
            <Typography fontWeight={500} fontSize={18}>
              {file.name || file.file.name}
            </Typography>
            <Typography color='text.secondary'>
              {(file.file.size / (1024 * 1024)).toFixed(1)}MB
            </Typography>
            {file.error && file.aborted ? (
              <Typography
                className={styles.upload__icon}
                variant='h6'
                color={theme.palette.primary.light}
                onClick={() => handleRetryUpload(file)}
              >
                Try Again
              </Typography>
            ) : !isUploading && !isCompleted && file.progress === undefined ? (
              <form onSubmit={formik.handleSubmit}>
                <Box
                  display='grid'
                  gridTemplateColumns='minmax(240px, 1fr) auto'
                  gridTemplateRows='auto auto'
                  columnGap={2}
                  rowGap={0.5}
                  alignItems='start'
                >
                  <TextField
                    id='initialFinalName'
                    name='initialFinalName'
                    label='File Name'
                    variant='standard'
                    placeholder={file.name}
                    value={formik.values.initialFinalName}
                    onChange={handleChange}
                    className={styles.upload__text_field}
                    onBlur={formik.handleBlur}
                    error={showError}
                    sx={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}
                  />

                  <Button
                    className={styles.upload__button}
                    type='submit'
                    loading={formik.isSubmitting || uploadMutation.isPending}
                    sx={{ gridColumn: '2 / 3', gridRow: '1 / 2', alignSelf: 'start' }}
                  >
                    Upload
                  </Button>

                  {showError && (
                    <FormHelperText
                      error
                      sx={{
                        gridColumn: '1 / 2',
                        gridRow: '2 / 3',
                        m: 0,
                        fontSize: 13,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {formik.errors.initialFinalName}
                    </FormHelperText>
                  )}

                  {showPreview && (
                    <FormHelperText
                      sx={{ gridColumn: '1 / 2', gridRow: '2 / 3', m: 0, fontSize: 13 }}
                    >
                      {`${formik.values.initialFinalName}_${file.uniqueFileId}_${facilityNameDisplay}_${todayDate}`}
                    </FormHelperText>
                  )}
                </Box>
              </form>
            ) : null}
          </Box>
        </Box>
        {isUploading && (
          <CancelIcon className={styles.upload__icon} onClick={() => abortUpload(file)} />
        )}

        {isInitialPhase && (
          <CancelIcon
            className={styles.upload__icon}
            onClick={() => setUploadingFiles((prev) => prev.filter((f) => f.id !== file.id))}
          />
        )}

        {showDelete && (
          <DeleteIcon
            className={styles.upload__icon}
            onClick={() => setUploadingFiles((prev) => prev.filter((f) => f.id !== file.id))}
          />
        )}
      </Box>

      {isUploading && (
        <Box display='flex' alignItems='center' gap={1} flex={1}>
          <LinearProgress
            variant='determinate'
            value={file.progress ?? 0}
            className={styles.upload__progress}
          />
          <Typography pl={1} pt={1.7} variant='body2' color='text.secondary'>
            {file.progress ?? 0}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadItem;
