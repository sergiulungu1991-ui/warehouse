'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/form-controls';

type CategoryTreeToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  resultCount: number;
  totalCount: number;
  /** Rendered at the end of the bar, after the result counter */
  trailing?: ReactNode;
};

export function CategoryTreeToolbar({
  query,
  onQueryChange,
  onExpandAll,
  onCollapseAll,
  resultCount,
  totalCount,
  trailing,
}: CategoryTreeToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <SearchInput
        value={query}
        onValueChange={onQueryChange}
        placeholder="Search category..."
        aria-label="Search categories"
        className="min-w-40 flex-1"
      />

      <Button variant="secondary" size="sm" icon="expand" onClick={onExpandAll}>
        Expand
      </Button>
      <Button variant="secondary" size="sm" icon="collapse" onClick={onCollapseAll}>
        Collapse
      </Button>

      <span
        aria-live="polite"
        className="whitespace-nowrap px-1 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{resultCount}</span> /{' '}
        {totalCount}
      </span>

      {query.trim() && (
        <Button variant="ghost" size="sm" onClick={() => onQueryChange('')}>
          Reset
        </Button>
      )}

      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
}
