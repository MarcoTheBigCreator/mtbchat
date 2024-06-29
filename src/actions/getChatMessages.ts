'use server';

import { fetchRedis } from '@/helpers';
import { messageArrayValidator } from '@/lib';

export const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedMessages);

    return {
      ok: true,
      messages,
    };
  } catch (error) {
    return {
      ok: false,
      messages: [],
    };
  }
};
