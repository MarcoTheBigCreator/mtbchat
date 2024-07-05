import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/auth.config';
import { getChatMessages } from '@/actions';
import { Messages } from '@/components';
import { fetchRedis } from '@/helpers';

interface Props {
  params: {
    chatId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chatId } = params;

  return {
    metadataBase: new URL(
      `https://mtbchat.vercel.app/dashboard/chat/${chatId}`
    ),
    title: `Chat`,
    description: 'Chat with your friends in real-time!',
    openGraph: {
      title: `Chat`,
      description: 'Chat with your friends in real-time! | MTBCHAT',
      url: `https://mtbchat.vercel.app/dashboard/chat/${chatId}`,
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720073471/Portfolio/h3vu4u6lubfjvr9on717.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Chat`,
      description: 'Chat with your friends in real-time! | MTBCHAT',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720073471/Portfolio/h3vu4u6lubfjvr9on717.png`,
      ],
    },
  };
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = params;

  const session = await auth();
  // just in case middleware fails
  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  const [userId1, userId2] = chatId.split('--');

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const { ok, messages: initialMessages } = await getChatMessages(chatId);

  if (!ok) {
    notFound();
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-15rem)] md:max-h-[calc(100vh-10rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200 dark:border-neutral-700 px-4">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-lg md:text-xl flex items-center">
              <span className="text-gray-700 dark:text-white mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              {chatPartner.email}
            </span>
          </div>
        </div>
      </div>
      <Messages
        sessionId={session.user.id}
        chatId={chatId}
        initialMessages={initialMessages}
        sessionImg={session.user.image}
        chatPartner={chatPartner}
      />
    </div>
  );
}
