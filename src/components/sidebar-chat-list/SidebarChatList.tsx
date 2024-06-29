'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { chatHrefConstructor, toPusherKey } from '@/lib';
import PusherClient from 'pusher-js';
import toast from 'react-hot-toast';
import { UnseenChatToast } from '../unseen-chat-toast/UnseenChatToast';
import Image from 'next/image';

interface SidebarChatListProps {
  sessionId: string;
  friends: User[];
}

interface ExtedendMessage extends Message {
  senderImg: string;
  senderName: string;
}

export const SidebarChatList = ({
  sessionId,
  friends,
}: SidebarChatListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [useenMessages, setUseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    const pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: 'us2',
      }
    );

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = () => {
      router.refresh();
    };

    const chatHandler = (message: ExtedendMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));

      setUseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('new_message', chatHandler);
    pusherClient.bind('new_friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = useenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-violet-700 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-base leading-6 font-semibold"
            >
              <Image
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg "
                referrerPolicy="no-referrer"
                alt={`${friend.name} profile picture`}
                src={friend.image}
                width={100}
                height={100}
              />
              <span className="truncate">
                {friend.name}
                {unseenMessagesCount > 0 && (
                  <div className="bg-violet-700 font-medium text-xs text-white w-4 h-4 rounded-full flex items-center justify-center">
                    {unseenMessagesCount}
                  </div>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};
