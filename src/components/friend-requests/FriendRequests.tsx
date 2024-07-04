'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { toPusherKey } from '@/lib';
import PusherClient from 'pusher-js';
interface FriendRequestsProps {
  sessionId: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

export const FriendRequests = ({
  sessionId,
  incomingFriendRequests,
}: FriendRequestsProps) => {
  const router = useRouter();

  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
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

    const friendRequestsHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [
        ...prev,
        {
          senderId,
          senderEmail,
        },
      ]);
    };

    pusherClient.bind('incoming_friend_requests', friendRequestsHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind('incoming_friend_requests', friendRequestsHandler);
    };
  }, [sessionId]);

  const acceptFriendRequest = async (senderId: string) => {
    await axios.post('/api/friends/accept', { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriendRequest = async (senderId: string) => {
    await axios.post('/api/friends/deny', { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-base text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="md:flex items-center">
            <div className="flex gap-1 md:mr-3">
              <UserPlus className="text-black dark:text-gray-300 pb-1" />
              <p className="text-black dark:text-gray-300 font-medium text-base">
                {request.senderEmail}
              </p>
            </div>
            <div className="flex gap-4 mt-2 ml-4 md:m-0">
              <button
                onClick={() => acceptFriendRequest(request.senderId)}
                aria-label="accept friend"
                className="grid place-items-center transition md:border-l-2 md:border-gray-300 dark:md:border-neutral-700"
              >
                <span className="ml-3 font-semibold text-sm text-violet-700 dark:text-violet-500 hover:underline">
                  Accept
                </span>
              </button>

              <button
                onClick={() => denyFriendRequest(request.senderId)}
                aria-label="deny friend"
                className="grid place-items-center transition"
              >
                <span className="font-semibold text-sm text-red-500 hover:underline">
                  Deny
                </span>
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};
