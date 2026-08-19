'use client';

import { useCallback, useMemo, useState } from 'react';
import type { SortDirection } from '@/components/ui/data-table';

type SortableValue = string | number | null | undefined;

export type UseTableSortResult<T> = {
  sortBy: string;
  direction: SortDirection;
  toggle: (columnId: string) => void;
  apply: (rows: T[]) => T[];
};

/**
 * Generic client-side sorting for DataTable columns.
 * Column ids are resolved against the row through `accessors`, falling back to
 * the plain property with the same name.
 */
export function useTableSort<T>(
  initialSortBy: string,
  accessors: Record<string, (row: T) => SortableValue> = {},
): UseTableSortResult<T> {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [direction, setDirection] = useState<SortDirection>('asc');

  const toggle = useCallback(
    (columnId: string) => {
      if (columnId === sortBy) {
        setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        return;
      }
      setSortBy(columnId);
      setDirection('asc');
    },
    [sortBy],
  );

  const apply = useCallback(
    (rows: T[]) => {
      const read =
        accessors[sortBy] ??
        ((row: T) => (row as Record<string, unknown>)[sortBy] as SortableValue);
      const factor = direction === 'asc' ? 1 : -1;

      return [...rows].sort((a, b) => {
        const left = read(a);
        const right = read(b);
        if (left == null) return 1;
        if (right == null) return -1;
        if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
        return String(left).localeCompare(String(right)) * factor;
      });
    },
    [sortBy, direction, accessors],
  );

  return useMemo(() => ({ sortBy, direction, toggle, apply }), [sortBy, direction, toggle, apply]);
}
