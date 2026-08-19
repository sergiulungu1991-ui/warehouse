import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  /** Optional secondary line, e.g. "3 overdue" */
  hint?: string;
  tone?: 'default' | 'accent' | 'danger';
};

const VALUE_TONES = {
  default: 'text-fg',
  accent: 'text-accent-text',
  danger: 'text-red-400',
} as const;

export function StatCard({
  label,
  value,
  icon: IconComponent,
  href,
  hint,
  tone = 'default',
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-md border border-line bg-surface-200 p-3 transition-colors hover:border-line-strong hover:bg-surface-300"
    >
      <div className="flex items-center gap-2">
        <IconComponent className="h-3.5 w-3.5 text-fg-subtle" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
          {label}
        </span>
      </div>
      <p className={cn('mt-2 font-mono text-2xl font-semibold', VALUE_TONES[tone])}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-fg-muted">{hint}</p>}
    </Link>
  );
}
