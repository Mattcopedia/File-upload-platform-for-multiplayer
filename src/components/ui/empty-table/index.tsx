import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';

import BoardIcon from '@/assets/icons/boards.svg';
import styles from '@/components/ui/pagination/pagination-styles.module.css';
import { APP_ROUTES } from '@/constants';

interface EmptyTableProps {
  text: string;
  subText?: string;
  buttonText?: string;
  showButton?: boolean;
  startIcon?: boolean;
}

const EmptyTable = ({ text, subText, buttonText, showButton, startIcon }: EmptyTableProps) => {
  return (
    <div className={styles.list__empty}>
      <BoardIcon />
      <Typography textAlign={'center'}>{text}</Typography>
      {subText && <Typography textAlign={'center'}>{subText}</Typography>}
      {showButton && (
        <Button
          href={APP_ROUTES.UPLOAD_FILE}
          component={Link}
          variant='contained'
          startIcon={startIcon ? <AddIcon /> : null}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyTable;
