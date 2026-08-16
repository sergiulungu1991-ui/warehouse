import { Skeleton, SkeletonRows } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/ui/page-container';

/** Shared Suspense fallback for every admin route */
export default function AdminLoading() {
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between lg:mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl lg:h-28" />
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <SkeletonRows rows={5} />
      </div>
    </PageContainer>
  );
}
