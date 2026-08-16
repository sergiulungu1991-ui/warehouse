'use client';

import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Icon } from './icon';

export const CONTROL_CLASS =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50';

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchInput({ value, onValueChange, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Icon
        name="search"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={`${CONTROL_CLASS} pl-9`}
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
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={`${CONTROL_CLASS} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
