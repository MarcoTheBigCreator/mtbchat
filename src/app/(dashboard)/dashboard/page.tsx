import { auth } from '@/auth.config';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1>Hello Page</h1>
    </div>
  );
}
