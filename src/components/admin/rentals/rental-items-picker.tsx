'use client';

import { useMemo, useState } from 'react';
import type { Item } from '@/types';
import { SearchInput } from '@/components/ui/form-controls';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { CONTROL_CLASS } from '@/components/ui/form-controls';
import type { RentalLine } from './rental-form-state';

type RentalItemsPickerProps = {
  items: Item[];
  lines: RentalLine[];
  onChange: (lines: RentalLine[]) => void;
  /** Returned quantities are only editable while editing an existing rental */
  showReturned?: boolean;
  error?: string;
};

export function RentalItemsPicker({
  items,
  lines,
  onChange,
  showReturned = false,
  error,
}: RentalItemsPickerProps) {
  const [query, setQuery] = useState('');

  const itemById = useMemo(
    () => new Map(items.map((item) => [String(item.id), item])),
    [items],
  );

  const available = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const selected = new Set(lines.map((line) => line.itemId));
    return items
      .filter((item) => !selected.has(String(item.id)))
      .filter((item) => !normalized || item.name.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [items, lines, query]);

  const addLine = (itemId: string) =>
    onChange([...lines, { itemId, quantity: 1, returnedQuantity: 0 }]);

  const updateLine = (itemId: string, patch: Partial<RentalLine>) =>
    onChange(lines.map((line) => (line.itemId === itemId ? { ...line, ...patch } : line)));

  return (
    <div className="space-y-4">
      <div>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search items to add..."
          aria-label="Search items"
        />

        {available.length > 0 && (
          <ul className="mt-2 divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {available.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {item.name}
                  <span className="ml-2 text-xs text-zinc-400">{item.quantity} in stock</span>
                </span>
                <Button size="sm" variant="secondary" icon="plus" onClick={() => addLine(String(item.id))}>
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lines.length > 0 && (
        <ul className="space-y-2">
          {lines.map((line) => (
            <li
              key={line.itemId}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {itemById.get(line.itemId)?.name ?? `Item #${line.itemId}`}
              </span>

              <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                Qty
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(event) =>
                    updateLine(line.itemId, { quantity: Math.max(1, Number(event.target.value)) })
                  }
                  className={`${CONTROL_CLASS} w-20`}
                />
              </label>

              {showReturned && (
                <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Returned
                  <input
                    type="number"
                    min={0}
                    max={line.quantity}
                    value={line.returnedQuantity}
                    onChange={(event) =>
                      updateLine(line.itemId, {
                        returnedQuantity: Math.max(0, Number(event.target.value)),
                      })
                    }
                    className={`${CONTROL_CLASS} w-20`}
                  />
                </label>
              )}

              <button
                type="button"
                aria-label="Remove item"
                onClick={() => onChange(lines.filter((entry) => entry.itemId !== line.itemId))}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
