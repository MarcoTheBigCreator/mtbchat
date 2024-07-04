import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import {
  FriendRequestsSidebarOptions,
  Icons,
  MobileChatLayout,
  SidebarChatList,
  SignOutButton,
  ThemeSwitch,
} from '@/components';
import { getFriendsByUserId, getUnseenRequestCount } from '@/actions';
import { titleFont } from '@/config/fonts';
import { SidebarOption } from '@/types/typings';
import { truncateText } from '@/lib';

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    icon: 'UserPlus',
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // just in case
  if (!session) {
    redirect('/login');
  }

  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestCount =
    (await getUnseenRequestCount(session.user.id)) || 0;

  return (
    <div className="w-full flex h-screen bg-white dark:bg-neutral-900">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-x-auto md:overflow-x-hidden overflow-y-auto border-r border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 px-6">
        <Link
          href="/dashboard"
          className="flex h-16 shrink-0 items-center my-4 group"
        >
          <Icons.Logo className="h-10 w-10 text-black dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-500 transition-all duration-200 ease-in-out" />
          <span
            className={`${titleFont.className} font-normal text-3xl pl-1 text-black dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-500 transition-all duration-200 ease-in-out`}
          >
            MTBCHAT
          </span>
        </Link>

        <div>
          <ThemeSwitch />
        </div>

        {/* Chats */}
        {friends.length > 0 && (
          <div className="text-sm font-semibold leading-6 text-gray-400 dark:text-white">
            Your Chats
          </div>
        )}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-sm font-semibold leading-6 text-gray-400 dark:text-white">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.icon];

                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-violet-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-violet-500 dark:hover:bg-neutral-800 group flex gap-3 rounded-md p-2 text-base leading-6 font-semibold group"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:text-violet-700 group-hover:border-violet-700 dark:text-neutral-300 dark:group-hover:text-neutral-300 dark:border-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white dark:bg-violet-600 dark:group-hover:bg-violet-500">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestsSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            {/* Profile */}
            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-4 py-3 text-base font-semibold leading-6 text-gray-900 dark:text-white">
                <div className="relative h-8 w-8 bg-transparent">
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
        </nav>
      </div>
      <aside className="md:container max-h-screen pt-16 md:py-4 w-full bg-white dark:bg-neutral-900">
        {children}
      </aside>
    </div>
  );
}
