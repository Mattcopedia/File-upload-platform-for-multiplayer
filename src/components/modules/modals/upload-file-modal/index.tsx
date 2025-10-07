'use client';

import { useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';

import Checked from '@/assets/icons/checked.svg';
import FileModalIcon from '@/assets/icons/fileSelect.svg';
import Unchecked from '@/assets/icons/unchecked.svg';
import theme from '@/assets/styles/theme';
import styles from '@/components/modules/modals/upload-file-modal/index.module.css';
import { AllowedMimeTypesEnum } from '@/constants';
import { buildAcceptString } from '@/utils/file-validation';

const fileObj = [
  {
    id: 0,
    textHeader: 'ZIP Upload',
    text: 'Got several files in a zip file? Then upload a zip file.',
    Icon: <FileModalIcon />,
  },
  {
    id: 1,
    textHeader: 'Individual Upload',
    text: 'Got files that are not related? choose one or select several at a time with Individual Upload',
    Icon: <FileModalIcon />,
  },
];

interface uploadFileModalProps {
  open: boolean;
  handleCloseModal: () => void;
  onFilesSelected: (files: FileList | null, type: number | null) => void;
}

const UploadFileModal = ({ open, handleCloseModal, onFilesSelected }: uploadFileModalProps) => {
  const [chosenFileUploadType, setChosenFileUploadType] = useState<number | null>(null);

  return (
    <>
      <Dialog className={styles.upload__dialogBox} onClose={handleCloseModal} open={open}>
        <Box display={'flex'} alignSelf={'flex-end'}>
          <IconButton onClick={handleCloseModal}>
            <CloseRoundedIcon className={styles.upload__close_icon} />
          </IconButton>
        </Box>

        <Box className={styles.upload__modal}>
          <Typography
            marginBottom={2}
            mt={1}
            color={theme.palette.text.primary}
            variant='h5'
            textAlign={'center'}
          >
            How do you want to proceed
          </Typography>
          <Typography my={2} color={theme.palette.text.primary} variant='h6' textAlign={'center'}>
            You may upload a maximum of 30 files at once.
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'row'} gap={2.5}>
          {fileObj.map((file) => (
            <Box
              onClick={() => setChosenFileUploadType(file.id)}
              className={`${styles.upload_file} ${chosenFileUploadType === file.id ? styles.upload_file_selected : ''}`}
              key={file.id}
            >
              <Box justifySelf={'flex-end'}>
                {chosenFileUploadType === file.id ? <Checked /> : <Unchecked />}
              </Box>

              <Box display={'flex'} flexDirection={'column'} gap={2}>
                {file.Icon}
                <Typography variant='h5'>{file.textHeader}</Typography>
                <Typography>{file.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box display={'flex'} flexDirection={'row'} mt={5} justifyContent={'flex-end'}>
          <Button
            onClick={handleCloseModal}
            variant='outlined'
            className={styles.upload__cancelButton}
          >
            Cancel
          </Button>
          <Button size='medium' variant='contained' component='label'>
            Continue
            {chosenFileUploadType === 1 ? (
              <input
                type='file'
                hidden
                accept={buildAcceptString(Object.values(AllowedMimeTypesEnum))}
                multiple
                onChange={(event) => {
                  const selectedFiles = (event.target as HTMLInputElement).files;
                  onFilesSelected(selectedFiles, 1);
                  handleCloseModal();
                }}
              />
            ) : (
              <input
                type='file'
                hidden
                accept='application/zip'
                onChange={(e) => {
                  onFilesSelected(e.target.files, 0);
                  handleCloseModal();
                }}
              />
            )}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default UploadFileModal;
