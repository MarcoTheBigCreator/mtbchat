# MTBCHAT

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

### Running in Development

1. Clone the repository
2. Create a copy of the `.env.template` file, rename it to `.env`, and update the environment variables:
   - Create an account on [Upstash](https://upstash.com/) and set up a new Redis project. Add the Redis connection URL to your `.env` file.
   - Set up your authentication providers and add the necessary environment variables for NextAuth.js.
   - Create an account on [Pusher](https://pusher.com/) and set up a new project. Add the Pusher keys to your `.env` file.
3. Install dependencies with `npm install`
4. Start the project with `npm run dev`

### Running in Production

1. Ensure all environment variables are set up correctly in your hosting platform (e.g., Vercel).
2. Build the project with `npm run build`
3. Start the production server with `npm start`
