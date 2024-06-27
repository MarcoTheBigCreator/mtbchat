'use server';

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || url.length === 0) {
  throw new Error(`UPSTASH_REDIS_REST_URL is not set ${url}`);
}

if (!token || token.length === 0) {
  throw new Error(`UPSTASH_REDIS_REST_TOKEN is not set ${token}`);
}

export const db = async () => {
  const redis = new Redis({
    url,
    token,
  });

  return redis;
};
