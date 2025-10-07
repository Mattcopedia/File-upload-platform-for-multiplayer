'use client';

import React, { useState } from 'react';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import styles from '@/components/pages/login/login-styles.module.css';
import { APP_ROUTES } from '@/constants';
import { loginSchema } from '@/services/auth/schema';

export default function LoginPageComponent() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: { email: string; password: string }) => {
      console.log('Login was successful');
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl');

      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: callbackUrl || APP_ROUTES.UPLOAD_FILE,
      });
      if (result?.error) {
        toast.error('Invalid credentials. Please try again.');
      } else if (result?.ok) {
        toast.success('Logged in successfully');
        router.replace(result.url ?? APP_ROUTES.UPLOAD_FILE);
      }
    },
  });

  return (
    <form className={styles.login__form} onSubmit={formik.handleSubmit}>
      <header>
        <Typography variant='h4' component='h1'>
          Login
        </Typography>
        <Typography mt={2} variant='body2' className={styles.login__text}>
          Enter your account details to login
        </Typography>
      </header>
      <div>
        <Box>
          <TextField
            placeholder='Enter Email Address'
            id='email'
            name='email'
            label='Email'
            variant='standard'
            className={styles.login__text_bottom}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
        </Box>

        <FormControl variant='standard' fullWidth className={styles.login__text_bottom}>
          <InputLabel shrink htmlFor='password'>
            Password
          </InputLabel>
          <Input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            autoComplete='new-password'
            value={formik.values.password}
            onChange={formik.handleChange}
            endAdornment={
              <InputAdornment position='end'>
                <Box mr={2}>
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </Box>
              </InputAdornment>
            }
          />
          {formik.errors.password && (
            <FormHelperText error>{formik.errors.password}</FormHelperText>
          )}
        </FormControl>

        <Button type='submit' className={styles.login__mt} loading={formik.isSubmitting}>
          Login
        </Button>
      </div>
    </form>
  );
}
