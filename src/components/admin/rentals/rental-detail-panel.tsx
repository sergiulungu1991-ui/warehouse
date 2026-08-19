'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Rental } from '@/types';
import { Button, ButtonLink } from '@/components/ui/button';
import { DetailPanel, DetailRow, type DetailTab } from '@/components/ui/detail-panel';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { RentalStatusBadge } from './rental-status-badge';
import { formatDate, isRentalOverdue } from './rental-utils';

type RentalDetailPanelProps = {
  rental: Rental;
  onClose: () => void;
  onDeleted: () => void;
};

export function RentalDetailPanel({ rental, onClose, onDeleted }: RentalDetailPanelProps) {
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);
  const overdue = isRentalOverdue(rental);

  async function handleDelete() {
    if (!(await confirmDelete(`rental for "${rental.renter_name}"`))) return;

    setDeleting(true);
    // Line items reference the rental, so they have to go first
    await supabase.from('rental_items').delete().eq('rental_id', rental.id);
    const { error } = await supabase.from('rentals').delete().eq('id', rental.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Rental deleted');
    onClose();
    onDeleted();
  }

  const tabs: DetailTab[] = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <div>
          <DetailRow label="Renter">{rental.renter_name}</DetailRow>
          <DetailRow label="Phone">{rental.renter_phone || '—'}</DetailRow>
          <DetailRow label="Email">{rental.renter_email || '—'}</DetailRow>
          <DetailRow label="Status">
            <RentalStatusBadge status={rental.status} overdue={overdue} />
          </DetailRow>
          <DetailRow label="Rented at">{formatDate(rental.rented_at) ?? '—'}</DetailRow>
          <DetailRow label="Expected return">
            {formatDate(rental.expected_return_at) ?? '—'}
          </DetailRow>
          <DetailRow label="Returned at">{formatDate(rental.returned_at) ?? '—'}</DetailRow>
          <DetailRow label="Notes">
            {rental.notes ? <span className="whitespace-pre-line">{rental.notes}</span> : '—'}
          </DetailRow>
        </div>
      ),
    },
    {
      value: 'raw',
      label: 'Raw data',
      content: (
        <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-fg-muted">
          {JSON.stringify(rental, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <DetailPanel
      title={rental.renter_name}
      subtitle={formatDate(rental.rented_at) ?? undefined}
      tabs={tabs}
      onClose={onClose}
      footer={
        <>
          <ButtonLink href={`/admin/rentals/${rental.id}`} variant="secondary" size="sm">
            Open page
          </ButtonLink>
          <ButtonLink
            href={`/admin/rentals/${rental.id}/edit`}
            variant="secondary"
            size="sm"
            icon={Pencil}
          >
            Edit
          </ButtonLink>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            className="ml-auto"
            loading={deleting}
            onClick={handleDelete}
            aria-label="Delete rental"
          />
        </>
      }
    />
  );
}
