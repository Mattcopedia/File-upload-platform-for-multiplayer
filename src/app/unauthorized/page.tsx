'use client';

import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import styles from '@/app/unauthorized/page-styles.module.css';

const Page = () => {
  const message = 'You don"t have permission to view this resource...';
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className={styles.container}>
      <Typography color='error'>Permission Denied</Typography>
      <Typography>{`${message}`}</Typography>
      <Button size='small' onClick={handleGoBack}>
        Go back.
      </Button>
    </div>
  );
};

export default Page;
