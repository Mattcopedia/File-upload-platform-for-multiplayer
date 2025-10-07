import { SVGProps } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, CircularProgress, Dialog, IconButton, Typography } from '@mui/material';

import theme from '@/assets/styles/theme';
import Pulse from '@/components/animation/pulse';
import styles from '@/components/modules/modals/delete-file-modal/index.module.css';

interface FileDeleteModalProps {
  open: boolean;
  handleCloseModal: () => void;
  actionText: string;
  descriptionText: string;
  isPending: boolean;
  files: string[] | null;
  actionButtonText: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  action: (files: string[]) => void;
  isDelete?: boolean;
}

const FileDeleteModal = ({
  open,
  Icon,
  handleCloseModal,
  actionText,
  descriptionText,
  isPending,
  actionButtonText,
  files,
  action,
}: FileDeleteModalProps) => {
  return (
    <>
      <Dialog
        className={styles.list__dialogBox}
        maxWidth={'sm'}
        onClose={handleCloseModal}
        open={open}
      >
        <Box position={'absolute'} top={8} right={8} paddingRight={3} paddingTop={2}>
          <IconButton onClick={handleCloseModal}>
            <CloseRoundedIcon className={styles.list__close_icon} />
          </IconButton>
        </Box>

        <Box className={styles.list__modal}>
          <Pulse color='error'>
            <Icon />
          </Pulse>

          <Typography
            marginBottom={2}
            marginTop={3}
            color={theme.palette.secondary.main}
            variant='h5'
            textAlign={'center'}
          >
            {actionText}
          </Typography>
          <Typography textAlign={'center'}>{descriptionText}</Typography>
        </Box>
        {files && files.length > 0 && (
          <Box textAlign='center' mb={3.5} mt={2}>
            {files.length === 1 ? (
              <Typography fontWeight={500}>{files[0]}</Typography>
            ) : (
              <>
                <Typography fontWeight={500}>{`You selected ${files.length} files`}</Typography>
                <Typography fontWeight={500}>{files.join(', ')}</Typography>
              </>
            )}
          </Box>
        )}
        {files && (
          <Button
            sx={{ mb: 2 }}
            size='large'
            disabled={isPending}
            onClick={() => action(files)}
            variant={isPending ? 'contained' : 'delete'}
          >
            <CircularProgress
              sx={{
                mr: 1,
                opacity: isPending ? 1 : 0,
              }}
              size={20}
              color='inherit'
            />
            <Typography paddingRight={3} component={'span'}>
              {actionButtonText}
            </Typography>
          </Button>
        )}

        <Button onClick={handleCloseModal} color='secondary' variant='outlined' size='large'>
          Cancel{' '}
        </Button>
      </Dialog>
    </>
  );
};

export default FileDeleteModal;
