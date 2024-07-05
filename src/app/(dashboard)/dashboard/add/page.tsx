import { Metadata } from 'next';
import { AddFriendButton } from '@/components';
import { titleFont } from '@/config/fonts';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://mtbchat.vercel.app/dashboard/add'),
    title: 'Add a new friend! ',
    description: 'Add a friend and start chatting!',
    openGraph: {
      title: 'Add a new friend! | MTBCHAT',
      description: 'Add a friend and start chatting!',
      url: 'https://mtbchat.vercel.app/dashboard/add',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720072460/Portfolio/nibiq11insld8gooekgo.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Add a new friend! | MTBCHAT',
      description: 'Add a friend and start chatting!',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720072460/Portfolio/nibiq11insld8gooekgo.png`,
      ],
    },
  };
}

export default function AddFriendsPage() {
  return (
    <main className="pt-8 p-[1.25rem]">
      <h1
        className={`${titleFont.className} text-black dark:text-white font-bold text-5xl mb-8`}
      >
        Add a friend
      </h1>
      <AddFriendButton />
    </main>
  );
}
