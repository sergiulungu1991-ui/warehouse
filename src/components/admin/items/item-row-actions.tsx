'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { IconButton, IconButtonLink, RowActions } from '@/components/ui/icon-button';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

type ItemRowActionsProps = {
  itemId: string;
  itemName: string;
  onDeleted?: () => void;
};

export function ItemRowActions({ itemId, itemName, onDeleted }: ItemRowActionsProps) {
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!(await confirmDelete(`"${itemName}"`))) return;

    setDeleting(true);
    // Images are removed first: the FK would otherwise block the delete
    await supabase.from('item_images').delete().eq('item_id', itemId);
    const { error } = await supabase.from('items').delete().eq('id', itemId);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Item deleted');
    onDeleted?.();
  }

  return (
    <RowActions>
      <IconButtonLink href={`/admin/items/${itemId}`} icon="eye" label="View item" />
      <IconButtonLink href={`/admin/items/${itemId}/edit`} icon="edit" label="Edit item" />
      <IconButton
        icon="trash"
        label="Delete item"
        tone="danger"
        onClick={handleDelete}
        disabled={deleting}
      />
    </RowActions>
  );
}
