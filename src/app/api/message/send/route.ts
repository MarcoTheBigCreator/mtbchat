import { NextResponse } from 'next/server';
import { fetchRedis } from '@/helpers';
import { auth } from '@/auth.config';
import {
  db,
  Message,
  messageValidator,
  pusherServer,
  toPusherKey,
} from '@/lib';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();
    const session = await auth();
    const redis = await db();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [userId1, userId2] = chatId.split('--');

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    // notify all connected clients
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      message
    );

    // all validations passed so we can save the message
    redis.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
