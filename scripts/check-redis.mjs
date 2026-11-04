import { lookup } from 'node:dns/promises';

async function checkRedis() {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!restUrl || !token) {
    throw new Error(
      'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for the environment being checked.'
    );
  }

  let url;
  try {
    url = new URL(restUrl);
  } catch {
    throw new Error('UPSTASH_REDIS_REST_URL must be a valid HTTPS REST URL.');
  }

  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Use the HTTPS REST URL from the Upstash console.');
  }

  try {
    await lookup(url.hostname);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      throw new Error(
        `Redis hostname ${url.hostname} does not resolve. Check the database status and REST URL in Upstash, then update both the local and deployment environment variables.`
      );
    }
    throw new Error(`Redis DNS lookup failed (${error.code || 'unknown error'}).`);
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['PING']),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error('Redis HTTPS request failed. Check network access and database availability.');
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('Redis rejected the REST token. Verify that the URL and token belong to the same database.');
  }

  if (!response.ok) {
    throw new Error(`Redis returned HTTP ${response.status}. Check database availability in Upstash.`);
  }

  const data = await response.json();
  if (data.result !== 'PONG') {
    throw new Error('Redis did not return PONG. Verify the REST URL and database status.');
  }

  console.log(`Redis connection OK (${url.hostname}): PONG`);
}

try {
  await checkRedis();
} catch (error) {
  console.error(`Redis check failed: ${error.message}`);
  process.exitCode = 1;
}
