import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DescriptionList } from '@/components/ui/description-list';
import { ItemGallery } from '@/components/admin/items/item-gallery';
import { ItemStockSummary } from '@/components/admin/items/item-stock-summary';
import { ItemRentalSections } from '@/components/admin/items/item-rental-history';
import type { ItemRental } from '@/components/admin/items/item-rental-types';
import { formatDate } from '@/components/admin/rentals/rental-utils';
import { getAvailableByItemIds, calculateAvailable } from '@/lib/item-availability';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function loadItem(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('items')
    .select('*, categories(id, name)')
    .eq('id', id)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await loadItem(id);
  return { title: item?.name ?? 'Item' };
}

export default async function ItemViewPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const item = await loadItem(id);
  if (!item) notFound();

  const [images, rentedByItem, rentalItems] = await Promise.all([
    supabase.from('item_images').select('*').eq('item_id', id).order('sort_order'),
    getAvailableByItemIds([id]).then((map) => map[id] ?? 0),
    supabase
      .from('rental_items')
      .select('quantity, returned_quantity, rentals!inner(*)')
      .eq('item_id', id)
      .order('created_at', { ascending: false }),
  ]);

  const available = calculateAvailable(item.quantity, rentedByItem);
  const itemImages = [...(images.data ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  );

  const rentals: ItemRental[] = (rentalItems.data ?? []).map((row) => {
    const rental = Array.isArray(row.rentals) ? row.rentals[0] : row.rentals;
    return { ...rental, quantity: row.quantity, returned_quantity: row.returned_quantity };
  });

  return (
    <PageContainer fullWidth>
      <PageHeader
        title={item.name}
        actions={
          <>
            <ButtonLink
              href={`/admin/items/${item.id}/edit`}
              variant="secondary"
              icon="edit"
              size="sm"
            >
              Edit
            </ButtonLink>
            <ButtonLink href={`/admin/rentals/add?itemId=${item.id}`} icon="calendar" size="sm">
              Create rental
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          <ItemGallery images={itemImages} name={item.name} />

          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <DescriptionList
                items={[
                  { label: 'Brand', value: item.brand || '—' },
                  { label: 'Model', value: item.model || '—' },
                  {
                    label: 'Category',
                    value: item.categories ? (
                      <Link
                        href={`/admin/categories/${item.categories.id}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {item.categories.name}
                      </Link>
                    ) : (
                      'No category'
                    ),
                  },
                  { label: 'Created', value: formatDate(item.created_at) ?? '—' },
                  {
                    label: 'Description',
                    value: item.description ? (
                      <p className="whitespace-pre-line">{item.description}</p>
                    ) : (
                      '—'
                    ),
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <ItemStockSummary total={item.quantity} available={available} />
          <ItemRentalSections rentals={rentals} />
        </div>
      </div>
    </PageContainer>
  );
}
