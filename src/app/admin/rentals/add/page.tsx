import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { RentalForm } from '@/components/admin/rentals/rental-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Add rental' };

type PageProps = { searchParams: Promise<{ itemId?: string }> };

export default async function AddRentalPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const [{ data: items }, { itemId }] = await Promise.all([
    supabase.from('items').select('*').order('name'),
    searchParams,
  ]);

  // Deep link from an item page pre-selects that item
  const initialLines = itemId ? [{ itemId, quantity: 1, returnedQuantity: 0 }] : [];

  return (
    <PageContainer narrow>
      <PageHeader title="Add rental" description="Register equipment leaving the warehouse" />
      <RentalForm items={items ?? []} initialLines={initialLines} />
    </PageContainer>
  );
}
