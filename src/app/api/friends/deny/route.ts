import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import { z } from 'zod';
import { db } from '@/lib';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    const redis = await db();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    redis.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request payload', { status: 422 });
    }

    return new NextResponse('Invalid request', { status: 400 });
  }
}
