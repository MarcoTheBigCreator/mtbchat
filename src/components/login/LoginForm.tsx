'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button, GitHubLogo, GoogleLogo } from '@/components';

export const LoginForm = () => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);

  async function loginWithGoogle() {
    setIsLoadingGoogle(true);

    try {
      await signIn('google');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  async function loginWithGitHub() {
    setIsLoadingGithub(true);

    try {
      await signIn('github');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoadingGithub(false);
    }
  }

  return (
    <>
      <Button
        isLoading={isLoadingGoogle}
        type="button"
        className="max-w-sm mx-auto w-full"
        onClick={loginWithGoogle}
      >
        {isLoadingGoogle ? null : <GoogleLogo />}
        Google
      </Button>

      <Button
        isLoading={isLoadingGithub}
        type="button"
        className="max-w-sm mx-auto w-full"
        onClick={loginWithGitHub}
      >
        {isLoadingGithub ? null : <GitHubLogo />}
        GitHub
      </Button>
    </>
  );
};
