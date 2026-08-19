'use client';

import type { ReactNode } from 'react';

type TableToolbarProps = {
  /** Filters, search and sort controls */
  children: ReactNode;
  /** Primary action, pushed to the far right */
  action?: ReactNode;
  resultCount?: number;
  totalCount?: number;
};

/** Sticky control strip above a data table */
export function TableToolbar({ children, action, resultCount, totalCount }: TableToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-line bg-surface-100 px-2 py-1.5">
      {children}

      {resultCount !== undefined && (
        <span aria-live="polite" className="whitespace-nowrap px-1 text-[11px] text-fg-subtle">
          <span className="font-medium text-fg">{resultCount}</span>
          {totalCount !== undefined && ` of ${totalCount}`}
        </span>
      )}

      {action && <div className="ml-auto flex items-center gap-1.5">{action}</div>}
    </div>
  );
}
