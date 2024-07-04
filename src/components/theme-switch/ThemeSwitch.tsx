'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Icons } from '../icons/Icons';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="w-6 h-6 animate-pulse bg-gray-400 dark:bg-neutral-700 rounded-lg" />
    );

  if (resolvedTheme === 'dark') {
    return (
      <button
        type="button"
        onClick={() => setTheme('light')}
        className="focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-full text-sm"
      >
        <Icons.Sun className="w-6 h-6 text-white hover:text-violet-500" />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className="focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-full text-sm"
      >
        <Icons.Moon className="w-6 h-6 text-gray-400 hover:text-violet-700" />
      </button>
    );
  }
};
