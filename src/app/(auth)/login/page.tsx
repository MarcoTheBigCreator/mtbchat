import { Metadata } from 'next';
import { Icons, LoginForm } from '@/components';
import { titleFont } from '@/config/fonts';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://mtbchat.vercel.app/login'),
    title: 'Login',
    description:
      'Login to create an account and chat with your friends in real-time!',
    openGraph: {
      title: 'Login | MTBCHAT',
      url: 'https://mtbchat.vercel.app/login',
      description:
        'Login to create an account and chat with your friends in real-time!',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720080439/Portfolio/tkmkd6jxcwrbjqkdif1x.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Login | MTBCHAT',
      description:
        'Login to create an account and chat with your friends in real-time!',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720080439/Portfolio/tkmkd6jxcwrbjqkdif1x.png`,
      ],
    },
  };
}

export default function LoginPage() {
  return (
    <>
      <div className="bg-white dark:bg-neutral-900 flex h-screen items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <div className="flex h-16 shrink-0 items-center my-4 ">
              <Icons.Logo className="h-12 w-12 text-black dark:text-white " />
            </div>
            <h2
              className={`${titleFont.className} mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100`}
            >
              Sign in to your account
            </h2>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
