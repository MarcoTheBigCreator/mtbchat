import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const request = (path, options) =>
  fetch(new URL(path, baseUrl), {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
    ...options,
  });

test('login renders both OAuth providers and its compiled assets load', async () => {
  const response = await request('/login');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Google/);
  assert.match(html, /GitHub/i);

  const assets = [...html.matchAll(/(?:src|href)="([^" ]+\.(?:js|css)(?:\?[^" ]*)?)"/g)]
    .map((match) => match[1])
    .filter((path) => path.startsWith('/_next/'));
  assert.ok(assets.some((path) => path.includes('.js')));
  assert.ok(assets.some((path) => path.includes('.css')));

  for (const asset of new Set(assets)) {
    const assetResponse = await request(asset);
    assert.equal(assetResponse.status, 200, asset);
    await assetResponse.arrayBuffer();
  }
});

for (const path of [
  '/dashboard',
  '/dashboard/add',
  '/dashboard/requests',
  '/dashboard/chat/smoke-user--other-user',
]) {
  test(`anonymous access to ${path} redirects to login`, async () => {
    const response = await request(path);
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get('location'), baseUrl).pathname, '/login');
  });
}

test('anonymous sessions are null', async () => {
  const response = await request('/api/auth/session');
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test('Google and GitHub auth providers remain available', async () => {
  const response = await request('/api/auth/providers');
  assert.equal(response.status, 200);
  const providers = await response.json();
  assert.equal(providers.google.type, 'oidc');
  assert.equal(providers.github.type, 'oauth');
});

test('NextAuth issues a CSRF token and cookie', async () => {
  const response = await request('/api/auth/csrf');
  assert.equal(response.status, 200);
  assert.ok((await response.json()).csrfToken);
  assert.ok(response.headers.get('set-cookie'));
});

for (const [path, body] of [
  ['/api/friends/add', { email: { email: 'smoke@example.com' } }],
  ['/api/friends/accept', { id: 'smoke-user' }],
  ['/api/friends/deny', { id: 'smoke-user' }],
  ['/api/message/send', { text: 'smoke test', chatId: 'smoke-user--other-user' }],
]) {
  test(`anonymous POST to ${path} returns 401`, async () => {
    const response = await request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 401);
    assert.equal(await response.text(), 'Unauthorized');
  });
}
