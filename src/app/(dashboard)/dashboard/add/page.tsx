import { AddFriendButton } from '@/components';
import { titleFont } from '@/config/fonts';

export default function AddFriendsPage() {
  return (
    <main className="pt-8">
      <h1 className={`${titleFont.className} font-bold text-5xl mb-8`}>
        Add a friend
      </h1>
      <AddFriendButton />
    </main>
  );
}
