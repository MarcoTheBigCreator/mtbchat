import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import { db } from '@/lib';
import { getChatMessages } from '@/actions';

interface Props {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = params;

  const redis = await db();

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
  const chatPartner = (await redis.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <div>
      <h1>Hello Page</h1>
    </div>
  );
}
