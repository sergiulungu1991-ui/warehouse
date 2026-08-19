'use client';

import { ImageIcon } from 'lucide-react';
import type { ItemWithRelations } from '@/lib/items-data';
import { ItemQuantityBadge } from './item-quantity-badge';

type ItemCardProps = {
  item: ItemWithRelations;
  onSelect: () => void;
};

export function ItemCard({ item, onSelect }: ItemCardProps) {
  const imageUrl = item.images[0]?.url;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group overflow-hidden rounded-md border border-line bg-surface-200 text-left transition-colors hover:border-line-strong hover:bg-surface-300"
    >
      <div className="relative aspect-square bg-surface-300">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-6 w-6 text-fg-subtle" />
          </div>
        )}
        <div className="absolute right-1.5 top-1.5">
          <ItemQuantityBadge available={item.available} total={item.quantity} />
        </div>
      </div>

      <div className="p-2">
        <p className="truncate text-xs font-medium text-fg">{item.name}</p>
        <p className="truncate text-[11px] text-fg-subtle">
          {[item.categories?.name || 'No category', item.brand].filter(Boolean).join(' · ')}
        </p>
      </div>
    </button>
  );
}
