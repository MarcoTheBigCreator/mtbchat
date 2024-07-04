import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingPage() {
  return (
    <div className="w-full flex flexcol gap-3 p-[1.25rem]">
      <Skeleton className="mb-4" height={60} width={500} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
    </div>
  );
}
