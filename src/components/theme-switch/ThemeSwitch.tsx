'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Icons } from '../icons/Icons';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const ThemeSwitch = () => {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const { setTheme, resolvedTheme } = useTheme();
  const [iconAnimation, setIconAnimation] = useState('icon-enter');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIconAnimation('icon-enter-active');
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleClick = () => {
    setIconAnimation('icon-enter');
    setTimeout(() => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      setTimeout(() => {
        setIconAnimation('icon-enter-active');
      }, 100);
    }, 300);
  };

  if (!mounted)
    return (
      <div className="w-6 h-6 animate-pulse bg-gray-400 dark:bg-neutral-700 rounded-lg" />
    );

  return (
    <button
      type="button"
      onClick={handleClick}
      className="focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-full text-sm"
    >
      {resolvedTheme === 'dark' ? (
        <Icons.Sun
          className={`w-6 h-6 text-white hover:text-violet-500 icon-transition ${iconAnimation}`}
        />
      ) : (
        <Icons.Moon
          className={`w-6 h-6 text-gray-400 hover:text-violet-700 icon-transition ${iconAnimation}`}
        />
      )}
    </button>
  );
};
