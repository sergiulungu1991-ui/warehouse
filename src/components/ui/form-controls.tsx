'use client';

import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CONTROL_CLASS =
  'h-8 w-full rounded-md border border-line bg-surface-200 px-2.5 text-xs text-fg outline-none transition-colors placeholder:text-fg-subtle hover:border-line-strong focus:border-accent focus:ring-1 focus:ring-accent/30';

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchInput({ value, onValueChange, className = '', ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
      <input
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(CONTROL_CLASS, 'pl-8')}
        {...props}
      />
    </div>
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function Select({ value, onValueChange, className = '', children, ...props }: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(CONTROL_CLASS, 'cursor-pointer appearance-none pr-7')}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
    </div>
  );
}


