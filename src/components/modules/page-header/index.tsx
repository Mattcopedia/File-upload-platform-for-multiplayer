import { Typography } from '@mui/material';

import styles from '@/components/modules/page-header/index.module.css';
import { PageHeaderProps } from '@/components/modules/page-header/type';

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className={styles.page__header}>
      <Typography variant='h5' component='h1'>
        {title}
      </Typography>
      <div>{actions}</div>
    </div>
  );
}
