'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { ItemWithRelations } from '@/lib/items-data';
import { Button, ButtonLink } from '@/components/ui/button';
import { DetailPanel, DetailRow, type DetailTab } from '@/components/ui/detail-panel';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '../rentals/rental-utils';
import { ItemQuantityBadge } from '../item-quantity-badge';
import { ItemThumbnail } from './item-thumbnail';

type ItemDetailPanelProps = {
  item: ItemWithRelations;
  onClose: () => void;
  onDeleted: () => void;
};

export function ItemDetailPanel({ item, onClose, onDeleted }: ItemDetailPanelProps) {
  const router = useRouter();
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const rented = Math.max(item.quantity - item.available, 0);

  async function handleDelete() {
    if (!(await confirmDelete(`"${item.name}"`))) return;

    setDeleting(true);
    // Images are removed first: the FK would otherwise block the delete
    await supabase.from('item_images').delete().eq('item_id', item.id);
    const { error } = await supabase.from('items').delete().eq('id', item.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Item deleted');
    onClose();
    onDeleted();
  }

  const tabs: DetailTab[] = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <div>
          {item.images.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto border-b border-line p-3">
              {item.images.map((image) => (
                <ItemThumbnail
                  key={image.url}
                  url={image.url}
                  name={item.name}
                  className="h-16 w-16"
                />
              ))}
            </div>
          )}

          <DetailRow label="Name">{item.name}</DetailRow>
          <DetailRow label="Category">
            {item.categories?.name ? (
              <Link
                href={`/admin/items?category=${item.category_id}`}
                className="text-accent-text hover:underline"
              >
                {item.categories.name}
              </Link>
            ) : (
              '—'
            )}
          </DetailRow>
          <DetailRow label="Brand">{item.brand || '—'}</DetailRow>
          <DetailRow label="Model">{item.model || '—'}</DetailRow>
          <DetailRow label="Total quantity">
            <span className="font-mono">{item.quantity}</span>
          </DetailRow>
          <DetailRow label="Rented out">
            <span className="font-mono">{rented}</span>
          </DetailRow>
          <DetailRow label="Available">
            <ItemQuantityBadge available={item.available} total={item.quantity} />
          </DetailRow>
          <DetailRow label="Created at">{formatDate(item.created_at) ?? '—'}</DetailRow>
          <DetailRow label="Description">
            {item.description ? (
              <span className="whitespace-pre-line">{item.description}</span>
            ) : (
              '—'
            )}
          </DetailRow>
        </div>
      ),
    },
    {
      value: 'raw',
      label: 'Raw data',
      content: (
        <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-fg-muted">
          {JSON.stringify(item, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <DetailPanel
      title={item.name}
      subtitle={item.categories?.name}
      tabs={tabs}
      onClose={onClose}
      footer={
        <>
          <ButtonLink href={`/admin/items/${item.id}`} variant="secondary" size="sm">
            Open page
          </ButtonLink>
          <ButtonLink
            href={`/admin/items/${item.id}/edit`}
            variant="secondary"
            size="sm"
            icon={Pencil}
          >
            Edit
          </ButtonLink>
          <ButtonLink
            href={`/admin/rentals/add?itemId=${item.id}`}
            size="sm"
            icon={CalendarPlus}
            onClick={() => router.refresh()}
          >
            Rent
          </ButtonLink>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            className="ml-auto"
            loading={deleting}
            onClick={handleDelete}
            aria-label="Delete item"
          />
        </>
      }
    />
  );
}
