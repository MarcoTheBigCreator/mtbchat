# [MTBCHAT](https://mtbchat.vercel.app/)

### Technologies used:

- Framework: [Next.js](https://nextjs.org/)
- Authentication: [NextAuth.js](https://next-auth.js.org/) con [@auth/upstash-redis-adapter](https://upstash.com/)
- Real-time Interactions: [Pusher](https://pusher.com/)
- Styling: [TailwindCSS](https://tailwindcss.com/) con [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- UI Components: [Headless UI](https://headlessui.dev/) y [Lucide React](https://lucide.dev/)
- Form Handling: [React Hook Form](https://react-hook-form.com/) y [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- Utilities: [clsx](https://github.com/lukeed/clsx), [date-fns](https://date-fns.org/), [nanoid](https://github.com/ai/nanoid), [axios](https://axios-http.com/), [react-hot-toast](https://react-hot-toast.com/), [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton), [react-textarea-autosize](https://github.com/Andarist/react-textarea-autosize)
- Validation: [Zod](https://zod.dev/)
- Hosting: [Vercel](https://vercel.com/)

## Description

MTBCHAT, a super fast chat application built with Next.js, Upstash and Pusher. Here you can chat with your friends in real-time. What are you waiting for? Join now!

### Running in Development

Use Node.js 24.22.2 or a newer patched release in the 24.x LTS line. The
project records this version in `.nvmrc`; keep the deployment runtime on Node 24
as well.

1. Clone the repository
2. Create a copy of the `.env.template` file, rename it to `.env`, and update the environment variables:
   - Create an account on [Upstash](https://upstash.com/) and set up a new Redis project. Add the Redis connection URL to your `.env` file.
   - Set up your authentication providers and add the necessary environment variables for NextAuth.js.
   - Create an account on [Pusher](https://pusher.com/) and set up a new project. Add the Pusher keys to your `.env` file.
3. Install the locked dependencies with `npm ci`
4. Start the project with `npm run dev`

### Running in Production

1. Ensure all environment variables are set up correctly in your hosting platform (e.g., Vercel).
2. Build the project with `npm run build`
3. Start the production server with `npm start`

### Checking changes

- `npm run lint` checks ESLint separately from the production build.
- `npm run typecheck` generates Next.js route types and checks TypeScript.
- `npm run build` creates the production build.
- `npm run check:redis` validates the Redis REST URL, DNS, and token with a
  read-only PING. It loads `.env` and `.env.local`; exported environment variables
  take precedence. Run this for the environment being deployed before testing
  OAuth sign-in. Anonymous smoke tests do not exercise the Redis adapter.
- `npm run test:smoke` checks the running app at `http://127.0.0.1:3000`.
  Start it with `npm start` first, or set `SMOKE_BASE_URL` for another local port.
  These checks use anonymous requests and do not create users or messages.
- `npm audit` checks the complete dependency tree; `npm audit --omit=dev` checks
  production dependencies.

After changing authentication or runtime dependencies, verify Google and GitHub
sign-in, session renewal, sign-out, friend requests, and real-time messages with
two accounts. Unauthenticated visitors must be redirected from dashboard routes,
and the friend and message API endpoints must return HTTP 401.

If sign-in logs contain `AdapterError`, `fetch failed`, and `ENOTFOUND` for an
Upstash hostname, check that the database is active and copy its current REST URL
and token from Upstash. Update `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` together in the local environment and in the applicable
Vercel environment (Production or Preview), then redeploy so the change takes
effect. A missing DNS record cannot be repaired by changing OAuth callbacks.

The current production dependency tree has no known npm audit vulnerabilities.
The complete audit still flags the ESLint toolchain because its plugins use
`minimatch` 3.x. The npm advisory marks all versions below 11.0.1 as affected,
while the [upstream advisory](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249)
describes pattern preprocessing in 10.2.6 with `optimizationLevel >= 2`. That
preprocessing API does not exist in 3.x. The TypeScript parser's 10.x dependency
is overridden to 11.0.4 or later. Keep the remaining audit finding under review
until the plugins or advisory are updated; replacing 3.x globally with 11.x
breaks the legacy callable API used by those plugins.
