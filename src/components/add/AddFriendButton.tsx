'use client';

import { useState } from 'react';
import { addFriendValidator } from '@/lib';
import { Button } from '../ui/Button';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = z.infer<typeof addFriendValidator>;

export const AddFriendButton = () => {
  const [showSuccessState, setShowSuccessState] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post('/api/friends/add', { email: validatedEmail });

      setShowSuccessState('Friend request sent!');
      setTimeout(() => {
        setShowSuccessState(null);
      }, 1500); // Mensaje de éxito desaparece después de 3 segundos
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', {
          message: error.message,
        });
        setTimeout(() => {
          clearErrors('email');
        }, 1500); // Mensaje de error desaparece después de 3 segundos
        return;
      }

      if (error instanceof AxiosError) {
        setError('email', {
          message: error.response?.data,
        });
        setTimeout(() => {
          clearErrors('email');
        }, 1500); // Mensaje de error desaparece después de 3 segundos
        return;
      }

      setError('email', {
        message: 'An unknown error occurred',
      });
      setTimeout(() => {
        clearErrors('email');
      }, 1500); // Mensaje de error desaparece después de 3 segundos
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-base font-medium leading-6 text-gray-900 dark:text-gray-300"
      >
        Add friend by e-mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          className="lowercase block w-full rounded-md border-0 py-1.5 text-gray-900 bg-white dark:bg-neutral-800 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:ring-neutral-700 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-700 dark:focus:ring-violet-500 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button className="dark:bg-violet-700 dark:text-white dark:hover:bg-violet-600">
          Add
        </Button>
      </div>
      <p className="mt-1 text-base text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-base text-green-600">{showSuccessState}</p>
      )}
    </form>
  );
};
