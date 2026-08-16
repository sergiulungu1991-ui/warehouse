import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DescriptionList } from '@/components/ui/description-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { RentalStatusBadge } from '@/components/admin/rentals/rental-status-badge';
import { formatDate, isRentalOverdue } from '@/components/admin/rentals/rental-utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function loadRental(id: string) {
  const { data } = await supabase.from('rentals').select('*').eq('id', id).single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rental = await loadRental(id);
  return { title: rental ? `Rental · ${rental.renter_name}` : 'Rental' };
}

export default async function RentalViewPage({ params }: PageProps) {
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
        breadcrumbs={[
          { label: 'Rentals', href: '/admin/rentals' },
          { label: rental.renter_name },
        ]}
        actions={
          <>
            <RentalStatusBadge status={rental.status} overdue={overdue} />
            <ButtonLink href={`/admin/rentals/${rental.id}/edit`} icon="edit">
              Edit
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Renter" />
          <CardBody>
            <DescriptionList
              items={[
                { label: 'Name', value: rental.renter_name },
                { label: 'Phone', value: rental.renter_phone || '—' },
                { label: 'Email', value: rental.renter_email || '—' },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Schedule" />
          <CardBody>
            <DescriptionList
              items={[
                { label: 'Rented at', value: formatDate(rental.rented_at) ?? '—' },
                {
                  label: 'Expected return',
                  value: (
                    <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : ''}>
                      {formatDate(rental.expected_return_at) ?? '—'}
                      {overdue && ' · overdue'}
                    </span>
                  ),
                },
                { label: 'Returned at', value: formatDate(rental.returned_at) ?? 'Not returned' },
                { label: 'Created', value: formatDate(rental.created_at) ?? '—' },
              ]}
            />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Rented items" description={`${lines.length} positions`} />
        {lines.length > 0 ? (
          <CardBody className="space-y-2">
            {lines.map((line) => (
              <div
                key={line.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/items/${line.item_id}`}
                    className="truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {line.items?.name ?? `Item #${line.item_id}`}
                  </Link>
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {[line.items?.brand, line.items?.model].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{line.quantity} taken</Badge>
                  <Badge tone={line.returned_quantity >= line.quantity ? 'success' : 'warning'}>
                    {line.returned_quantity} returned
                  </Badge>
                </div>
              </div>
            ))}
          </CardBody>
        ) : (
          <EmptyState icon="box" title="No items" description="This rental has no positions." />
        )}
      </Card>

      {rental.notes && (
        <Card className="mt-6">
          <CardHeader title="Notes" />
          <CardBody>
            <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
              {rental.notes}
            </p>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
