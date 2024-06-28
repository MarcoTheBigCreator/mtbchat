import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  // just in case middleware fails
  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Hello Page</h1>
      {/* <pre>{JSON.stringify(session)}</pre> */}
    </div>
  );
}
