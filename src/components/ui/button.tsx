import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
  secondary: 'border border-line bg-surface-300 text-fg hover:bg-surface-400 hover:border-line-strong',
  ghost: 'text-fg-muted hover:bg-surface-300 hover:text-fg',
  danger: 'border border-red-900/40 bg-red-950/40 text-red-400 hover:bg-red-950/70',
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'h-6 gap-1 px-2 text-[11px]',
  sm: 'h-7 gap-1.5 px-2.5 text-xs',
  md: 'h-8 gap-1.5 px-3 text-xs',
};

const BASE =
  'inline-flex shrink-0 items-center justify-center rounded-md font-medium leading-none transition-colors disabled:pointer-events-none disabled:opacity-50';

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
};

export const buttonClassName = ({
  variant = 'primary',
  size = 'sm',
  className = '',
}: SharedProps) => cn(BASE, VARIANTS[variant], SIZES[size], className);

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

export function Button({
  variant,
  size = 'sm',
  icon: IconComponent,
  loading = false,
  children,
  className,
  type = 'button',
  disabled,
  ...props
}: SharedProps & ComponentProps<'button'> & { loading?: boolean }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn(ICON_SIZE[size], 'animate-spin')} />
      ) : (
        IconComponent && <IconComponent className={ICON_SIZE[size]} />
      )}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size = 'sm',
  icon: IconComponent,
  children,
  className,
  ...props
}: SharedProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClassName({ variant, size, className })} {...props}>
      {IconComponent && <IconComponent className={ICON_SIZE[size]} />}
      {children}
    </Link>
  );
}
