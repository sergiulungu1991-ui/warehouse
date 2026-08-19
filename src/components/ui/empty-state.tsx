import type { ReactNode } from 'react';
import { Box, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: IconComponent = Box,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-300">
        <IconComponent className="h-4 w-4 text-fg-subtle" />
      </div>
      <h3 className="text-xs font-medium text-fg">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-[11px] text-fg-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
