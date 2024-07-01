import { AddFriendButton } from '@/components';
import { titleFont } from '@/config/fonts';

export default function AddFriendsPage() {
  return (
    <main className="pt-8 p-[1.25rem]">
      <h1 className={`${titleFont.className} font-bold text-5xl mb-8`}>
        Add a friend
      </h1>
      <AddFriendButton />
    </main>
  );
}
