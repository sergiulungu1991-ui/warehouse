import { Box, Calendar, Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tile = {
  label: string;
  value: number;
  icon: LucideIcon;
  className: string;
};

type ItemStockSummaryProps = {
  total: number;
  available: number;
};

/** Compact stock KPIs shown above the item details */
export function ItemStockSummary({ total, available }: ItemStockSummaryProps) {
  const rented = Math.max(total - available, 0);

  const tiles: Tile[] = [
    {
      label: 'In stock',
      value: total,
      icon: Box,
      className: 'border-line bg-surface-300 text-fg-muted',
    },
    {
      label: 'Rented out',
      value: rented,
      icon: Calendar,
      className: 'border-amber-900/40 bg-amber-950/40 text-amber-400',
    },
    {
      label: 'Available',
      value: available,
      icon: Check,
      className:
        available > 0
          ? 'border-accent/30 bg-accent-surface text-accent-text'
          : 'border-red-900/40 bg-red-950/40 text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-md border border-line bg-surface-200 p-2.5">
          <div className="flex items-center gap-2">
            <span className={cn('rounded border p-1', tile.className)}>
              <tile.icon className="h-3 w-3" />
            </span>
            <span className="truncate text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              {tile.label}
            </span>
          </div>
          <p className="mt-1.5 font-mono text-xl font-semibold text-fg">{tile.value}</p>
        </div>
      ))}
    </div>
  );
}
