'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput, Select } from '@/components/ui/form-controls';
import { ALL_STATUSES } from '@/hooks/use-rental-filters';
import { formatStatusLabel } from './rental-utils';

type RentalsFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions: string[];
  isFiltered: boolean;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
  /** Rendered at the end of the bar, after the result counter */
  trailing?: ReactNode;
};

export function RentalsFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statusOptions,
  isFiltered,
  onReset,
  resultCount,
  totalCount,
  trailing,
}: RentalsFiltersProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <SearchInput
        value={query}
        onValueChange={onQueryChange}
        placeholder="Search by name, phone, email..."
        aria-label="Search rentals"
        className="min-w-40 flex-1"
      />

      <Select
        value={status}
        onValueChange={onStatusChange}
        aria-label="Filter by status"
        className="w-auto min-w-36 sm:w-44"
      >
        <option value={ALL_STATUSES}>All statuses</option>
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {formatStatusLabel(option)}
          </option>
        ))}
      </Select>

      <span
        aria-live="polite"
        className="whitespace-nowrap px-1 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{resultCount}</span> /{' '}
        {totalCount}
      </span>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      )}

      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
}
