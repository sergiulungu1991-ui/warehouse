'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: SegmentedControlOption<T>[];
  onChange: (value: T) => void;
  'aria-label': string;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex h-8 shrink-0 items-center gap-0.5 rounded-md border border-line bg-surface-200 p-0.5"
    >
      {options.map(({ value: optionValue, label, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          role="tab"
          aria-selected={value === optionValue}
          title={label}
          onClick={() => onChange(optionValue)}
          className={cn(
            'flex h-6 items-center gap-1.5 rounded px-2 text-xs font-medium transition-colors',
            value === optionValue
              ? 'bg-surface-400 text-fg'
              : 'text-fg-subtle hover:bg-surface-300 hover:text-fg',
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span className={Icon ? 'hidden sm:inline' : undefined}>{label}</span>
        </button>
      ))}
    </div>
  );
}
