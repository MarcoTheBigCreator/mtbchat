'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Icons } from '../icons/Icons';
import { titleFont } from '@/config/fonts';
import { usePathname } from 'next/navigation';
import { SidebarChatList } from '../sidebar-chat-list/SidebarChatList';
import { SignOutButton } from '../sign-out/SignOutButton';
import { FriendRequestsSidebarOptions } from '../friend-requests-sidebar/FriendRequestsSidebarOptions';
import type { Session } from 'next-auth';
import { SidebarOption } from '@/types/typings';
import { truncateText } from '@/lib';
import { ThemeSwitch } from '../theme-switch/ThemeSwitch';

interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
}

export const MobileChatLayout = ({
  friends,
  session,
  sidebarOptions,
  unseenRequestCount,
}: MobileChatLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed bg-zinc-50 dark:bg-neutral-900 border-b border-zinc-200 dark:border-neutral-700 top-0 z-50 inset-x-0 py-2 px-4">
      <div className="w-full flex justify-between items-center">
        <Link href="/dashboard">
          <Icons.Logo className="h-[2rem] w-[2rem] text-black dark:text-white hover:text-violet-700 dark:hover:text-violet-500 mx-4" />
        </Link>
        <span
          className={`${titleFont.className} text-black dark:text-white text-xl`}
        >
          MTBCHAT
        </span>
        <Button
          onClick={() => setOpen(true)}
          className="bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent text-black dark:text-white gap-4"
        >
          <Menu className="h-8 w-8" />
        </Button>
      </div>
      <Dialog
        as="div"
        className="relative z-10 bg-white dark:bg-neutral-900"
        open={open}
        onClose={setOpen}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-y-hidden">
          <div className="absolute inset-0 overflow-y-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-neutral-900  py-6 shadow-xl">
                    <div className="px-4 sm:px-6 pt-16">
                      <div className="flex items-start justify-between">
                        <div>
                          <ThemeSwitch />
                        </div>
                        <DialogTitle className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                          Dashboard
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-neutral-900 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Content */}

                    <ul
                      role="list"
                      className="grid grid-rows-2 grow mt-6 flex-1 px-4 sm:px-6"
                    >
                      <div className="space-y-7">
                        <li>
                          {friends.length > 0 ? (
                            <div className="text-sm font-semibold leading-6 text-gray-400 dark:text-white mb-2">
                              Your chats
                            </div>
                          ) : null}
                          <SidebarChatList
                            friends={friends}
                            sessionId={session.user.id}
                          />
                        </li>

                        <li>
                          <div className="text-sm font-semibold leading-6 text-gray-400 dark:text-white">
                            Overview
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {sidebarOptions.map((option) => {
                              const Icon = Icons[option.icon];
                              return (
                                <li key={option.name}>
                                  <Link
                                    href={option.href}
                                    className="text-gray-700 hover:text-violet-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-violet-500 dark:hover:bg-neutral-800 group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold"
                                  >
                                    <span className="text-gray-400 border-gray-200 group-hover:border-violet-700 group-hover:text-violet-700 dark:text-neutral-300 dark:group-hover:text-neutral-300 dark:border-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white dark:bg-violet-600 dark:group-hover:bg-violet-500">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="truncate">
                                      {option.name}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}

                            <li>
                              <FriendRequestsSidebarOptions
                                initialUnseenRequestCount={unseenRequestCount}
                                sessionId={session.user.id}
                              />
                            </li>
                          </ul>
                        </li>
                      </div>
                      <li className="-ml-6 mt-auto flex items-center">
                        <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-base font-semibold leading-6 text-gray-900 dark:text-white">
                          <div className="relative h-8 w-8">
                            <Image
                              fill
                              referrerPolicy="no-referrer"
                              className="rounded-full"
                              src={session.user.image || ''}
                              alt="Your profile picture"
                            />
                          </div>

                          <span className="sr-only">Your profile</span>
                          <div className="flex flex-col">
                            <span aria-hidden="true">
                              {truncateText(session.user.name)}
                            </span>
                            <span
                              className="text-xs text-zinc-400 dark:text-gray-300"
                              aria-hidden="true"
                            >
                              {truncateText(session.user.email)}
                            </span>
                          </div>
                        </div>

                        <SignOutButton className="h-full aspect-square" />
                      </li>
                    </ul>

                    {/* content end */}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
