'use client';

import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { RowActionsMenu, type RowAction } from '@/components/ui/row-actions-menu';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

type RentalRowActionsProps = {
  rentalId: string;
  renterName: string;
  onDeleted?: () => void;
};

export function RentalRowActions({ rentalId, renterName, onDeleted }: RentalRowActionsProps) {
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting || !(await confirmDelete(`the rental of ${renterName}`))) return;

    setDeleting(true);
    // Positions are removed first: the FK would otherwise block the delete
    await supabase.from('rental_items').delete().eq('rental_id', rentalId);
    const { error } = await supabase.from('rentals').delete().eq('id', rentalId);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Rental deleted');
    onDeleted?.();
  }

  const actions: RowAction[] = [
    { label: 'View', icon: Eye, href: `/admin/rentals/${rentalId}` },
    { label: 'Edit', icon: Pencil, href: `/admin/rentals/${rentalId}/edit` },
    { label: 'Delete', icon: Trash2, onSelect: handleDelete, tone: 'danger', separated: true },
  ];

  return <RowActionsMenu actions={actions} />;
}
