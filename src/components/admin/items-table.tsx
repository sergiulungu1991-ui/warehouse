import Link from 'next/link';
import type { ItemWithRelations } from '@/lib/items-data';
import { Icon } from '@/components/ui/icon';
import { ItemQuantityBadge } from './item-quantity-badge';
import { ItemRowActions } from './items/item-row-actions';

const HEADERS = [
  { label: 'Name', className: '' },
  { label: 'Category', className: 'hidden sm:table-cell' },
  { label: 'Brand', className: 'hidden md:table-cell' },
  { label: 'Quantity', className: '' },
  { label: 'Actions', className: 'text-right' },
];

type ItemsTableProps = {
  items: ItemWithRelations[];
  /** Called after a row was deleted so the list can refresh */
  onItemDeleted?: () => void;
};

export function ItemsTable({ items, onItemDeleted }: ItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header.label}
                  scope="col"
                  className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 lg:px-4 dark:text-zinc-400 ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                <td className="px-3 py-2 lg:px-4">
                  <div className="flex items-center gap-3">
                    <ItemThumbnail url={item.images[0]?.url} name={item.name} />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/items/${item.id}`}
                        className="block truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {item.name}
                      </Link>
                      {item.description && (
                        <p className="hidden max-w-xs truncate text-sm text-zinc-500 lg:block dark:text-zinc-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-zinc-700 sm:table-cell lg:px-4 dark:text-zinc-300">
                  {item.categories?.name || '—'}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-zinc-700 md:table-cell lg:px-4 dark:text-zinc-300">
                  {item.brand || '—'}
                </td>
                <td className="whitespace-nowrap px-3 py-2 lg:px-4">
                  <ItemQuantityBadge available={item.available} total={item.quantity} />
                </td>
                <td className="whitespace-nowrap px-3 py-2 lg:px-4">
                  <ItemRowActions
                    itemId={item.id}
                    itemName={item.name}
                    onDeleted={onItemDeleted}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemThumbnail({ url, name }: { url?: string; name: string }) {
  if (!url) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon name="image" className="h-6 w-6 text-zinc-400 dark:text-zinc-600" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
  );
}
