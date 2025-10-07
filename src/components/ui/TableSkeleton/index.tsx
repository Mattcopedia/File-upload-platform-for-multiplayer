import { Box, Skeleton, Stack } from '@mui/material';

import styles from '@/components/ui/TableSkeleton/index.module.css';

const TableSkeleton = () => {
  return (
    <Box className={styles.skeleton__wapper}>
      {[
        ...Array.from({ length: 4 }, (_, idx) => (
          <Stack key={idx} className={styles.skeleton__stack} spacing={1}>
            <Skeleton variant='text' animation='wave' width='100%' height={50} />
          </Stack>
        )),
      ]}
    </Box>
  );
};

export default TableSkeleton;
