import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RentalForm } from '@/components/admin/rentals/rental-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from('rentals').select('renter_name').eq('id', id).single();
  return { title: data ? `Edit rental · ${data.renter_name}` : 'Edit rental' };
}

export default async function EditRentalPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const [rental, items, rentalItems] = await Promise.all([
    supabase.from('rentals').select('*').eq('id', id).single(),
    supabase.from('items').select('*').order('name'),
    supabase.from('rental_items').select('item_id, quantity, returned_quantity').eq('rental_id', id),
  ]);

  if (!rental.data) notFound();

  const lines = (rentalItems.data ?? []).map((line) => ({
    itemId: String(line.item_id),
    quantity: line.quantity,
    returnedQuantity: line.returned_quantity,
  }));

  return (
    <PageContainer narrow>
      <PageHeader title={`Edit rental · ${rental.data.renter_name}`} />
      <RentalForm items={items.data ?? []} rental={rental.data} initialLines={lines} />
    </PageContainer>
  );
}
