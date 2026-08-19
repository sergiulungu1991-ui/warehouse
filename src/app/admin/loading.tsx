import { Skeleton, SkeletonRows } from '@/components/ui/skeleton';

/** Shared Suspense fallback for every admin route */
export default function AdminLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line px-2 py-1.5">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="ml-auto h-8 w-24" />
      </div>
      <SkeletonRows rows={10} />
    </div>
  );
}
