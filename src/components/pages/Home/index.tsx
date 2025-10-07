'use client';
import { useState } from 'react';

import { Backdrop, Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import UploadOutlinedIcon from '@/assets/icons/uploadFile.svg';
import UploadFileModal from '@/components/modules/modals/upload-file-modal';
import PageHeader from '@/components/modules/page-header';
import styles from '@/components/pages/Home/index.module.css';
import FileUploadItem from '@/components/ui/file-upload-item';
import { MAX_MEDIA } from '@/constants';
import { useUploadFilesContext } from '@/context/UploadFilesContext';
import { userData } from '@/utils/generate-unique-id';
import { unzipFile } from '@/utils/unzip';

const HomeComponent = () => {
  const theme = useTheme();
  const [open, setIsOpen] = useState(false);
  const [isUnzipping, setIsUnzipping] = useState(false);
  const { uploadingFiles, setUploadingFiles, addFiles } = useUploadFilesContext();
  const { data: session } = useSession();
  const user = session?.user;
  const facilityName = `${userData(user?.facility?.name)}`;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFilesSelected = async (files: FileList | null, type: number | null) => {
    if (!files || files.length === 0) return;
    if (type === 1) {
      addFiles(files);
      console.log('Files were selected');
    } else if (type === 0) {
      // ZIP upload
      setIsUnzipping(true);
      try {
        const extracted = await unzipFile(files[0]);

        if (!extracted.length) {
          toast.error('No valid files found in ZIP');
        } else {
          const dt = new DataTransfer();
          extracted.forEach((f) => dt.items.add(f));
          const limitedFiles = Array.from(dt.files).slice(0, MAX_MEDIA);
          addFiles(limitedFiles as unknown as FileList);
          if (extracted.length > MAX_MEDIA) {
            toast.success(
              `${extracted.length} files were found — only the first ${MAX_MEDIA} added`
            );
          } else {
            toast.success(`${extracted.length} file(s) extracted`);
          }
        }
      } catch {
        toast.error('Failed to unzip file');
      } finally {
        setIsUnzipping(false);
      }
    }
  };

  return (
    <>
      <UploadFileModal
        open={open}
        handleCloseModal={handleClose}
        onFilesSelected={handleFilesSelected}
      />

      <Box>
        <PageHeader title='Upload Files' />

        <Box className={`${styles.upload_container}`} py={5} onClick={() => setIsOpen(true)}>
          <Box>
            <UploadOutlinedIcon className={styles.upload__icon} />
          </Box>

          <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap={0.5}
          >
            <Typography variant='h6' pt={2}>
              <Typography variant='h5' color={theme.palette.primary.light} component='span'>
                Click here
              </Typography>{' '}
              to select your files
            </Typography>
            <Typography>
              Accepted file format ( PNG, PDF, JPG, JPEG, ZIP, TXT, CSV, only )
            </Typography>
            <Typography>
              All files should follow the naming convention:
              FileName_UniqueIDNumber_HospitalName_YYYYMMDD (Date of first entry on the folder)
            </Typography>
            <Typography>For example: 097956_CLNVO17UX3JQ_{facilityName}_20250101</Typography>
          </Box>
        </Box>

        {uploadingFiles.map((file, index) => (
          <FileUploadItem key={index} file={file} setUploadingFiles={setUploadingFiles} />
        ))}

        <Backdrop open={isUnzipping} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
            <CircularProgress />
            <Typography>Unzipping files — please wait…</Typography>
          </Box>
        </Backdrop>
      </Box>
    </>
  );
};

export default HomeComponent;
