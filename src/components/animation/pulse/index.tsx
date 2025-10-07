'use client';

import type { ButtonProps } from '@mui/material';

import styles from '@/components/animation/pulse/pulse-styles.module.css';
export default function Pulse({
  children,
  color = 'primary',
}: {
  color?: ButtonProps['color'];
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.pulse__icon_container} ${styles[color]}`}>
      <div className={styles.pulse__icon}>{children}</div>
      <div className={styles.pulse__icon_background}></div>
    </div>
  );
}
