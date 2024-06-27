'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button, GoogleLogo } from '@/components';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginWithGoogle() {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        isLoading={isLoading}
        type="button"
        className="max-w-sm mx-auto w-full"
        onClick={loginWithGoogle}
      >
        {isLoading ? null : <GoogleLogo />}
        Google
      </Button>
    </>
  );
};
