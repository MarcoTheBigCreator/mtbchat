import { notFound } from 'next/navigation';
import { auth } from '@/auth.config';
import { getIncomingFriendRequests, getUnseenRequests } from '@/actions';
import { FriendRequests } from '@/components';

export default async function RequestsPage() {
  const session = await auth();

  if (!session) {
    notFound();
  }

  // ids of people who have sent friend requests to this user
  const incomingSenderIds = (await getUnseenRequests(session.user.id)) || [];
  console.log(`incomingSenderIds: ${incomingSenderIds}`);

  // fetch the sender email
  const incomingFriendRequest = await getIncomingFriendRequests(
    incomingSenderIds
  );

  console.log(`incomingFriendRequest: ${incomingFriendRequest}`);

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          sessionId={session.user.id}
          incomingFriendRequests={incomingFriendRequest}
        />
      </div>
    </main>
  );
}
