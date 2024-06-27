'use server';

import { fetchRedis } from '@/helpers';

export const getUnseenRequests = async (sessionId: string) => {
  const unseenRequests = (await fetchRedis(
    'smembers',
    `user:${sessionId}:incoming_friend_requests`
  )) as string[];

  return unseenRequests;
};

export const getUnseenRequestCount = async (sessionId: string) => {
  const useenRequestsCount = (
    (await fetchRedis(
      'smembers',
      `user:${sessionId}:incoming_friend_requests`
    )) as User[]
  ).length;

  return useenRequestsCount;
};
