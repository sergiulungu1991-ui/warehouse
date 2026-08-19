import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: ReactNode;
  /** Constrain the content width, for forms and reading-oriented pages */
  narrow?: boolean;
  className?: string;
};

/**
 * Scrollable page body inside the admin shell.
 * Data-dense pages render edge to edge; `narrow` centers forms and detail views.
 */
export function PageContainer({ children, narrow = false, className = '' }: PageContainerProps) {
  return (
    <div className={cn('h-full overflow-y-auto', className)}>
      <div className={cn('w-full p-3', narrow && 'mx-auto max-w-3xl')}>{children}</div>
    </div>
  );
}
