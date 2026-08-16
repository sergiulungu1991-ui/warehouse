'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { IconButton, IconButtonLink, RowActions } from '@/components/ui/icon-button';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

type RentalRowActionsProps = {
  rentalId: string;
  renterName: string;
};

export function RentalRowActions({ rentalId, renterName }: RentalRowActionsProps) {
  const router = useRouter();
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!(await confirmDelete(`the rental of ${renterName}`))) return;

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
    router.refresh();
  }

  return (
    <RowActions>
      <IconButtonLink href={`/admin/rentals/${rentalId}`} icon="eye" label="View rental" />
      <IconButtonLink href={`/admin/rentals/${rentalId}/edit`} icon="edit" label="Edit rental" />
      <IconButton
        icon="trash"
        label="Delete rental"
        tone="danger"
        onClick={handleDelete}
        disabled={deleting}
      />
    </RowActions>
  );
}
