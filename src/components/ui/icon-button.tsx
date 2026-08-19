import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconButtonTone = 'neutral' | 'danger';

const TONES: Record<IconButtonTone, string> = {
  neutral: 'text-fg-muted hover:bg-surface-300 hover:text-fg',
  danger: 'text-fg-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400',
};

const BASE =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50';

type SharedProps = {
  icon: LucideIcon;
  /** Used as both the tooltip and the accessible name */
  label: string;
  tone?: IconButtonTone;
  className?: string;
};

export function IconButton({
  icon: IconComponent,
  label,
  tone = 'neutral',
  className = '',
  type = 'button',
  ...props
}: SharedProps & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      className={`${BASE} ${TONES[tone]} ${className}`}
      {...props}
    >
      <IconComponent className="h-4 w-4" />
    </button>
  );
}

export function IconButtonLink({
  icon: IconComponent,
  label,
  tone = 'neutral',
  className = '',
  ...props
}: SharedProps & ComponentProps<typeof Link>) {
  return (
    <Link title={label} aria-label={label} className={`${BASE} ${TONES[tone]} ${className}`} {...props}>
      <IconComponent className="h-4 w-4" />
    </Link>
  );
}

/** Right-aligned group for table row actions */
export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-0.5">{children}</div>;
}
