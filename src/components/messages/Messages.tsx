'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PusherClient from 'pusher-js';
import { cn, Message, toPusherKey } from '@/lib';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';

interface MessagesProps {
  sessionId: string;
  chatId: string;
  initialMessages: Message[];
  sessionImg: string | null | undefined;
  chatPartner: User;
}

export const Messages = ({
  sessionId,
  chatId,
  initialMessages,
  sessionImg,
  chatPartner,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: 'us2',
      }
    );

    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  const { theme } = useTheme();

  return (
    <div
      id="messages"
      className={cn(
        'flex h-full flex-1 flex-col-reverse gap-4 p-4 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch',
        {
          'scrollbar-thumb-dark': theme === 'dark',
          'scrollbar-thumb-blue': theme === 'light',
        }
      )}
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-violet-700 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-gray-200':
                      !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{' '}
                  <span
                    className={cn('ml-2 text-xs', {
                      'text-gray-300': isCurrentUser,
                      'text-gray-400 dark:text-neutral-400': !isCurrentUser,
                    })}
                  >
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
