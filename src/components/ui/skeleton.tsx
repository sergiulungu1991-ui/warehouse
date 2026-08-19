import { cn } from '@/lib/utils';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-400', className)} />;
}

export function SkeletonRows({ rows = 8, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={cn('divide-y divide-line', className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-2 px-3 py-2">
          <Skeleton className="h-8 w-8 shrink-0" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="hidden h-3 w-24 sm:block" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-md border border-line">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-1.5 p-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
