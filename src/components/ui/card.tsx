import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-md border border-line bg-surface-200', className)}>{children}</div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-line px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="truncate text-xs font-medium text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-[11px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-3', className)}>{children}</div>;
}

/** Uppercase group label used between sections of a dense panel */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
      {children}
    </p>
  );
}
