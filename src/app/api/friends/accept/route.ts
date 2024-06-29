import { NextResponse } from 'next/server';
import { fetchRedis } from '@/helpers';
import { auth } from '@/auth.config';
import { z } from 'zod';
import { db, pusherServer, toPusherKey } from '@/lib';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const redis = await db();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    // auth verification
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // verify both users are not already friends
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new NextResponse('Already friends', { status: 400 });
    }

    // verify the friend request exists
    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new NextResponse('Friend request not found', { status: 404 });
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${session.user.id}`),
      fetchRedis('get', `user:${idToAdd}`),
    ])) as [string, string];

    const [user, friend] = [
      JSON.parse(userRaw) as User,
      JSON.parse(friendRaw) as User,
    ];

    // notify added user
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        'new_friend',
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        'new_friend',
        friend
      ),

      // accept the friend request both ways
      redis.sadd(`user:${session.user.id}:friends`, idToAdd),
      redis.sadd(`user:${idToAdd}:friends`, session.user.id),
      redis.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
    ]);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request payload', { status: 422 });
    }

    return new NextResponse('Invalid request', { status: 400 });
  }
}
