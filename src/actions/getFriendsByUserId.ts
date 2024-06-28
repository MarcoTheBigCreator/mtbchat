'use server';

import { fetchRedis } from '@/helpers';

export const getFriendsByUserId = async (userId: string) => {
  // retrieve friends for the current user
  const friendsIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendsIds.map(async (friendId) => {
      const friend = (await fetchRedis('get', `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
};
