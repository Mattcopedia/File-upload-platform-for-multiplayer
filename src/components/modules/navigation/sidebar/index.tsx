'use client';

import { useState } from 'react';

import {
  Avatar,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import Files from '@/assets/icons/file-folder.svg';
import Logo from '@/assets/icons/logo.svg';
import SlideIcon from '@/assets/icons/slide.svg';
import UploadFile from '@/assets/icons/upload.svg';
import styles from '@/components/modules/navigation/sidebar/sidebar-styles.module.css';
import { NavItem, SideBarProps } from '@/components/modules/navigation/sidebar/types';
import { APP_ROUTES } from '@/constants';

// Define all navigation items with their required roles
const navItems: NavItem[] = [
  {
    title: 'Upload File',
    path: APP_ROUTES.UPLOAD_FILE,
    icon: <UploadFile className={`${styles.sidebar__icon}`} />,
  },
  {
    title: 'Files',
    path: APP_ROUTES.FILES,
    icon: <Files className={styles.sidebar__icon} />,
  },
];

const SideBar: React.FC<SideBarProps> = ({ collapsed, onToggle }) => {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const isActive = (path: string) => pathname === path;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    signOut();
  };

  return (
    <div>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebar__collapsed : ''}`}>
        <div className={styles.sidebar__header}>
          <IconButton className={styles.sidebar__toggle}>{collapsed ? '' : <Logo />}</IconButton>

          <IconButton className={styles.sidebar__slide} onClick={onToggle}>
            <SlideIcon />
          </IconButton>
        </div>

        <nav className={styles.sidebar__navigation}>
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NextLink href={item.path} passHref>
                  <MuiLink
                    component='span'
                    variant='subtitle1'
                    fontWeight='500'
                    className={`${styles.sidebar__link} ${isActive(item.path) ? styles.active : ''} ${
                      collapsed ? styles.sidebar__link_collapsed : ''
                    }`}
                  >
                    <span className={styles.sidebar__link_icon}>{item.icon}</span>
                    {!collapsed && <span className={styles.sidebar__link_title}>{item.title}</span>}
                  </MuiLink>
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebar__Footer}>
          <ButtonBase
            id='demo-positioned-button'
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            disableRipple
            className={styles.sidebar__user_profile}
          >
            {collapsed ? (
              <div className={styles.sidebar__user_actions}>
                <Avatar alt={user?.email}>{user?.email?.slice(0, 2) || ''}</Avatar>
              </div>
            ) : (
              <div className={styles.sidebar__user}>
                <Avatar alt={user?.email}>{user?.email?.slice(0, 2) || ''}</Avatar>
                <div className={styles.sidebar__user_details}>
                  <Typography
                    fontWeight='600'
                    variant='body2'
                    className={styles.sidebar__user_name}
                  >
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant='caption'>{user?.email}</Typography>
                </div>
              </div>
            )}
          </ButtonBase>
        </div>

        <Menu
          id='demo-positioned-menu'
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </aside>
    </div>
  );
};
export default SideBar;
