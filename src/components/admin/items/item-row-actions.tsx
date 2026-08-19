'use client';

import { useState } from 'react';
import { CalendarPlus, Eye, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { RowActionsMenu, type RowAction } from '@/components/ui/row-actions-menu';
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
    if (deleting || !(await confirmDelete(`"${itemName}"`))) return;

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

  const actions: RowAction[] = [
    { label: 'View', icon: Eye, href: `/admin/items/${itemId}` },
    { label: 'Edit', icon: Pencil, href: `/admin/items/${itemId}/edit` },
    { label: 'Create rental', icon: CalendarPlus, href: `/admin/rentals/add?itemId=${itemId}` },
    { label: 'Delete', icon: Trash2, onSelect: handleDelete, tone: 'danger', separated: true },
  ];

  return <RowActionsMenu actions={actions} />;
}
