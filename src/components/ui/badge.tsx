import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-line bg-surface-300 text-fg-muted',
  info: 'border-blue-900/40 bg-blue-950/40 text-blue-400',
  success: 'border-accent/30 bg-accent-surface text-accent-text',
  warning: 'border-amber-900/40 bg-amber-950/40 text-amber-400',
  danger: 'border-red-900/40 bg-red-950/40 text-red-400',
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  title?: string;
  className?: string;
};

export function Badge({ children, tone = 'neutral', title, className = '' }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Rental/record lifecycle indicator with a leading status dot */
export function StatusBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  const dot: Record<BadgeTone, string> = {
    neutral: 'bg-fg-subtle',
    info: 'bg-blue-400',
    success: 'bg-accent',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
  };

  return (
    <Badge tone={tone}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot[tone])} />
      {children}
    </Badge>
  );
}
