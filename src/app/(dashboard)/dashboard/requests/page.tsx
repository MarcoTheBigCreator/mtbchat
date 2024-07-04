import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/auth.config';
import { getIncomingFriendRequests, getUnseenRequests } from '@/actions';
import { FriendRequests } from '@/components';
import { titleFont } from '@/config/fonts';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://mtbchat.vercel.app/dashboard/requests'),
    title: 'Friend Requests',
    description: 'Accept or reject friend requests!',
    openGraph: {
      title: 'Friend Requests',
      description: 'Accept or reject friend requests!',
      url: 'https://mtbchat.vercel.app/dashboard/requests',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720074077/Portfolio/sxcdnltc1f0pogijysut.png`,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Friend Requests',
      description: 'Accept or reject friend requests!',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720074077/Portfolio/sxcdnltc1f0pogijysut.png`,
      ],
    },
  };
}

export default async function RequestsPage() {
  const session = await auth();

  if (!session) {
    notFound();
  }

  // ids of people who have sent friend requests to this user
  const incomingSenderIds = (await getUnseenRequests(session.user.id)) || [];

  // fetch the sender email
  const incomingFriendRequest = await getIncomingFriendRequests(
    incomingSenderIds
  );

  return (
    <main className="pt-8 overflow-y-auto p-[1.25rem]">
      <h1
        className={`${titleFont.className} text-black dark:text-white font-bold text-5xl mb-8`}
      >
        Friend Requests
      </h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          sessionId={session.user.id}
          incomingFriendRequests={incomingFriendRequest}
        />
      </div>
    </main>
  );
}
