import { auth } from '@/auth.config';
import { ChatInput } from '@/components';
import { fetchRedis } from '@/helpers';
import { notFound, redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: {
    chatId: string;
  };
}

export default async function ChatLayout({ children, params }: Props) {
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

  return (
    <>
      {children}
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </>
  );
}
