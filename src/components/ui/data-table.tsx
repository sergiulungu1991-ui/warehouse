'use client';

import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc';

export type Column<T> = {
  /** Stable key, also used as the sort key */
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Fixed width utility class, e.g. `w-24` */
  width?: string;
  align?: 'left' | 'right';
  sortable?: boolean;
  /** Hide below this breakpoint to keep the table readable on small screens */
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
};

const HIDE_CLASS = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
} as const;

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  activeRowKey?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange?: (columnId: string) => void;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  activeRowKey,
  sortBy,
  sortDirection,
  onSortChange,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-surface-300">
          <tr>
            {columns.map((column) => {
              const isSorted = sortBy === column.id;
              const canSort = column.sortable && onSortChange;
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'border-b border-line px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle',
                    column.align === 'right' ? 'text-right' : 'text-left',
                    column.width,
                    column.hideBelow && HIDE_CLASS[column.hideBelow],
                  )}
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.id)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-fg"
                    >
                      {column.header}
                      {isSorted ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const key = rowKey(row);
            const isActive = activeRowKey === key;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-line transition-colors',
                  onRowClick && 'cursor-pointer',
                  isActive ? 'bg-surface-400' : 'hover:bg-surface-300',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-3 py-2 align-middle text-fg',
                      column.align === 'right' ? 'text-right' : 'text-left',
                      column.hideBelow && HIDE_CLASS[column.hideBelow],
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
