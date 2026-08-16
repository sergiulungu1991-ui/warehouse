'use client';

import type { ReactNode } from 'react';
import type { FlatCategoryOption } from '@/lib/category-tree';
import { ALL_CATEGORIES, ALL_AVAILABILITY, RENTED_AVAILABILITY, AVAILABLE_AVAILABILITY } from '@/hooks/use-item-filters';
import type { AvailabilityFilter } from '@/hooks/use-item-filters';
import { Button } from '@/components/ui/button';
import { SearchInput, Select } from '@/components/ui/form-controls';

type ItemsFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  availability: AvailabilityFilter;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  categoryOptions: FlatCategoryOption[];
  isFiltered: boolean;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
  /** Rendered at the start of the bar, before the search field */
  leading?: ReactNode;
  /** Rendered at the end of the bar, after the result counter */
  trailing?: ReactNode;
};

const optionLabel = ({ name, depth }: FlatCategoryOption) =>
  `${'\u00A0\u00A0'.repeat(depth)}${depth ? '└ ' : ''}${name}`;

export function ItemsFilters({
  query,
  onQueryChange,
  categoryId,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  categoryOptions,
  isFiltered,
  onReset,
  resultCount,
  totalCount,
  leading,
  trailing,
}: ItemsFiltersProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      {leading}

      <SearchInput
        value={query}
        onValueChange={onQueryChange}
        placeholder="Search by name, brand, model..."
        aria-label="Search items"
        className="min-w-40 flex-1"
      />

      <Select
        value={categoryId}
        onValueChange={onCategoryChange}
        aria-label="Filter by category"
        title="Selecting a parent category also includes its subcategories"
        className="w-auto min-w-40 sm:w-52"
      >
        <option value={ALL_CATEGORIES}>All categories</option>
        {categoryOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {optionLabel(option)}
          </option>
        ))}
      </Select>

      <Select
        value={availability}
        onValueChange={(value) => onAvailabilityChange(value as AvailabilityFilter)}
        aria-label="Filter by availability"
        className="w-auto min-w-36 sm:w-44"
      >
        <option value={ALL_AVAILABILITY}>All items</option>
        <option value={RENTED_AVAILABILITY}>Rented</option>
        <option value={AVAILABLE_AVAILABILITY}>Available</option>
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
