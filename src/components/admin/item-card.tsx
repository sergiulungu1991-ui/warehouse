import Link from 'next/link';
import type { ItemWithRelations } from '@/lib/items-data';
import { Icon } from '@/components/ui/icon';
import { ItemQuantityBadge } from './item-quantity-badge';

export function ItemCard({ item }: { item: ItemWithRelations }) {
  const imageUrl = item.images[0]?.url;

  return (
    <Link
      href={`/admin/items/${item.id}`}
      className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="image" className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <ItemQuantityBadge available={item.available} total={item.quantity} />
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {item.name}
        </h3>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {[item.categories?.name || 'No category', item.brand].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  );
}
