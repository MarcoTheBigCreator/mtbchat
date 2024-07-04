'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PusherClient from 'pusher-js';
import { User } from 'lucide-react';
import { toPusherKey } from '@/lib';

interface FriendRequestsSidebarOptionsProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

export const FriendRequestsSidebarOptions = ({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestsSidebarOptionsProps) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
    const pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: 'us2',
      }
    );

    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestsHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    pusherClient.bind('incoming_friend_requests', friendRequestsHandler);
    pusherClient.bind('new_friend', addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind('incoming_friend_requests', friendRequestsHandler);

      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind('new_friend', addedFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-violet-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-violet-500 dark:hover:bg-neutral-800 group flex gap-3 rounded-md p-2 text-base leading-6 font-semibold group"
    >
      <div className="text-gray-400 border-gray-200 group-hover:text-violet-700 group-hover:border-violet-700 dark:text-neutral-300 dark:group-hover:text-neutral-300 dark:border-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white dark:bg-violet-600 dark:group-hover:bg-violet-500">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>
      {unseenRequestCount > 0 && (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-violet-700">
          {unseenRequestCount}
        </div>
      )}
    </Link>
  );
};
