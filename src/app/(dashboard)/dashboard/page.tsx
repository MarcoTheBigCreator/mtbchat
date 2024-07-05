import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth.config';
import { getFriendsByUserId } from '@/actions';
import { fetchRedis } from '@/helpers';
import { chatHrefConstructor } from '@/lib';
import { titleFont } from '@/config/fonts';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://mtbchat.vercel.app/dashboard'),
    title: 'Home',
    description:
      'MTBCHAT, a super fast chat application built with Next.js, Upstash and Pusher. Here you can chat with your friends in real-time. What are you waiting for? Join now!',
    openGraph: {
      title: 'Home | MTBCHAT',
      description:
        'MTBCHAT, a super fast web chat application built with Next.js, Upstash and Pusher, where you can communicate with your friends in real-time. What are you waiting for? Join now!',
      url: 'https://mtbchat.vercel.app/dashboard',
      siteName: 'MTBCHAT',
      type: 'website',
      locale: 'en_US',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720070596/Portfolio/gvojdfxzifvoiv7atb0x.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Home | MTBCHAT',
      description:
        'MTBCHAT, a super fast web chat application built with Next.js, Upstash and Pusher, where you can communicate with your friends in real-time. What are you waiting for? Join now!',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720070596/Portfolio/gvojdfxzifvoiv7atb0x.png`,
      ],
    },
  };
}

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
            className="relative bg-zinc-50 hover:bg-zinc-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-zinc-200 dark:border-neutral-700 dark:hover:border-neutral-600 p-3 rounded-md mb-3"
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
