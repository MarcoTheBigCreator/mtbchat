import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="w-full gap-3 p-[1.25rem]">
      <Skeleton className="mb-4 dark:bg-neutral-800" height={60} width={500} />
      <Skeleton className="dark:bg-neutral-800" height={20} width={150} />
      <Skeleton className="dark:bg-neutral-800" height={50} width={400} />
    </div>
  );
}
