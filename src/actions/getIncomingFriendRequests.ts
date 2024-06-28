'use server';

import { fetchRedis } from '@/helpers';

export const getIncomingFriendRequests = async (
  incomingSenderIds: string[]
) => {
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string;

      const senderParsed = JSON.parse(sender);

      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );

  return incomingFriendRequests;
};
