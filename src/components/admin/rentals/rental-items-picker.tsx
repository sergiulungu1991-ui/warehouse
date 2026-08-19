'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Item } from '@/types';
import { CONTROL_CLASS, SearchInput } from '@/components/ui/form-controls';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    <div className="space-y-3">
      <div>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search items to add..."
          aria-label="Search items"
        />

        {available.length > 0 && (
          <ul className="mt-1.5 overflow-hidden rounded-md border border-line">
            {available.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 border-b border-line px-2 py-1.5 last:border-b-0"
              >
                <span className="min-w-0 truncate text-xs text-fg-muted">
                  {item.name}
                  <span className="ml-2 font-mono text-[11px] text-fg-subtle">
                    {item.quantity} in stock
                  </span>
                </span>
                <Button
                  size="xs"
                  variant="secondary"
                  icon={Plus}
                  onClick={() => addLine(String(item.id))}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lines.length > 0 && (
        <ul className="overflow-hidden rounded-md border border-line">
          {lines.map((line) => (
            <li
              key={line.itemId}
              className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-300 px-2 py-1.5 last:border-b-0"
            >
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-fg">
                {itemById.get(line.itemId)?.name ?? `Item #${line.itemId}`}
              </span>

              <label className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
                Qty
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(event) =>
                    updateLine(line.itemId, { quantity: Math.max(1, Number(event.target.value)) })
                  }
                  className={cn(CONTROL_CLASS, 'w-16')}
                />
              </label>

              {showReturned && (
                <label className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
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
                    className={cn(CONTROL_CLASS, 'w-16')}
                  />
                </label>
              )}

              <button
                type="button"
                aria-label="Remove item"
                onClick={() => onChange(lines.filter((entry) => entry.itemId !== line.itemId))}
                className="flex h-6 w-6 items-center justify-center rounded text-fg-subtle transition-colors hover:bg-surface-400 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
