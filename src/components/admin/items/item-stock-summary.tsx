import { Icon, type IconName } from '@/components/ui/icon';

type Tile = {
  label: string;
  value: number;
  icon: IconName;
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
      icon: 'box',
      className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
    },
    {
      label: 'Rented out',
      value: rented,
      icon: 'calendar',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      label: 'Available',
      value: available,
      icon: 'check',
      className:
        available > 0
          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2">
            <span className={`rounded-lg p-1.5 ${tile.className}`}>
              <Icon name={tile.icon} className="h-4 w-4" />
            </span>
            <span className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {tile.label}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}
