import { notFound } from 'next/navigation';
import { auth } from '@/auth.config';
import { getFriendsByUserId } from '@/actions';
import { fetchRedis } from '@/helpers';
import { chatHrefConstructor } from '@/lib';
import { titleFont } from '@/config/fonts';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      if (lastMessageRaw === undefined) {
        console.warn(`No last message found for chat with friend ${friend.id}`);
        return {
          ...friend,
          lastMessage: {
            id: '',
            senderId: '',
            receiverId: '',
            text: '',
            timestamp: 0,
          },
        };
      }

      let lastMessage;
      try {
        lastMessage = JSON.parse(lastMessageRaw) as Message;
      } catch (error) {
        console.error(
          `Error parsing last message for chat with friend ${friend.id}:`,
          error
        );
        lastMessage = {
          id: '',
          senderId: '',
          receiverId: '',
          text: 'Error loading message',
          timestamp: 0,
        };
      }

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <div className="container py-12">
      <h1 className={`${titleFont.className} font-bold text-5xl mb-8`}>
        Recent chats
      </h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-base text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-violet-500">
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
