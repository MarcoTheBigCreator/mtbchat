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

  const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      cluster: 'us2',
    }
  );

  useEffect(() => {
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
  }, []);

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
          <div key={request.senderId} className="flex gap-3 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-base">{request.senderEmail}</p>
            <button
              onClick={() => acceptFriendRequest(request.senderId)}
              aria-label="accept friend"
              className="grid place-items-center transition border-l-2 border-gray-300"
            >
              <span className="ml-3 font-semibold text-black text-sm hover:text-violet-700 hover:underline">
                Accept
              </span>
            </button>

            <button
              onClick={() => denyFriendRequest(request.senderId)}
              aria-label="deny friend"
              className="grid place-items-center transition"
            >
              <span className="font-semibold text-black text-sm hover:text-red-500 hover:underline">
                Deny
              </span>
            </button>
          </div>
        ))
      )}
    </>
  );
};
