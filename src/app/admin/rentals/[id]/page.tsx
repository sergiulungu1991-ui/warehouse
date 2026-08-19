import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DetailRow } from '@/components/ui/detail-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { RentalStatusBadge } from '@/components/admin/rentals/rental-status-badge';
import { formatDate, isRentalOverdue } from '@/components/admin/rentals/rental-utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function loadRental(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('rentals').select('*').eq('id', id).single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rental = await loadRental(id);
  return { title: rental ? `Rental · ${rental.renter_name}` : 'Rental' };
}

export default async function RentalViewPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const rental = await loadRental(id);
  if (!rental) notFound();

  const { data: rentalItems } = await supabase
    .from('rental_items')
    .select('*, items(name, brand, model)')
    .eq('rental_id', id);

  const lines = rentalItems ?? [];
  const overdue = isRentalOverdue(rental);

  return (
    <PageContainer>
      <PageHeader
        title={rental.renter_name}
        description={`Rental #${rental.id}`}
        actions={
          <>
            <RentalStatusBadge status={rental.status} overdue={overdue} />
            <ButtonLink href={`/admin/rentals/${rental.id}/edit`} icon={Pencil} size="sm">
              Edit
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader title="Renter" />
          <div>
            <DetailRow label="Name">{rental.renter_name}</DetailRow>
            <DetailRow label="Phone">{rental.renter_phone || '—'}</DetailRow>
            <DetailRow label="Email">{rental.renter_email || '—'}</DetailRow>
          </div>
        </Card>

        <Card>
          <CardHeader title="Schedule" />
          <div>
            <DetailRow label="Rented at">{formatDate(rental.rented_at) ?? '—'}</DetailRow>
            <DetailRow label="Expected return">
              <span className={overdue ? 'font-medium text-red-400' : undefined}>
                {formatDate(rental.expected_return_at) ?? '—'}
                {overdue && ' · overdue'}
              </span>
            </DetailRow>
            <DetailRow label="Returned at">
              {formatDate(rental.returned_at) ?? 'Not returned'}
            </DetailRow>
            <DetailRow label="Created">{formatDate(rental.created_at) ?? '—'}</DetailRow>
          </div>
        </Card>
      </div>

      <Card className="mt-3">
        <CardHeader title="Rented items" description={`${lines.length} positions`} />
        {lines.length > 0 ? (
          <div>
            {lines.map((line) => (
              <div
                key={line.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2 last:border-b-0"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/items/${line.item_id}`}
                    className="truncate text-xs font-medium text-fg hover:underline"
                  >
                    {line.items?.name ?? `Item #${line.item_id}`}
                  </Link>
                  <p className="truncate text-[11px] text-fg-subtle">
                    {[line.items?.brand, line.items?.model].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge>{line.quantity} taken</Badge>
                  <Badge tone={line.returned_quantity >= line.quantity ? 'success' : 'warning'}>
                    {line.returned_quantity} returned
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Box} title="No items" description="This rental has no positions." />
        )}
      </Card>

      {rental.notes && (
        <Card className="mt-3">
          <CardHeader title="Notes" />
          <CardBody>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-fg-muted">
              {rental.notes}
            </p>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
