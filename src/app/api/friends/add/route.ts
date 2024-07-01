import { auth } from '@/auth.config';
import { fetchRedis } from '@/helpers';
import { addFriendValidator, db, pusherServer, toPusherKey } from '@/lib';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const redis = await db();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);
    const idToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string;

    console.log('idToAdd', idToAdd);

    if (!idToAdd) {
      return new NextResponse('This person does not exist', { status: 400 });
    }

    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.id === idToAdd) {
      return new NextResponse('You cannot add yourself as a friend', {
        status: 400,
      });
    }

    // check if the user is already added
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new NextResponse('You already added this person', { status: 400 });
    }

    // check if the user is already a friend
    const isAlreadyFriend = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new NextResponse('You are already friends with this person', {
        status: 400,
      });
    }

    // valid request send friend request
    await Promise.all([
      await pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
        'incoming_friend_requests',
        { senderId: session.user.id, senderEmail: session.user.email }
      ),

      redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id),
    ]);

    return new NextResponse('Friend request sent', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request payload', { status: 422 });
    }

    console.log(error);
    return new NextResponse('An unknown error occurred', { status: 400 });
  }
}
