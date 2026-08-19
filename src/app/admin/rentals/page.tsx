import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { RentalsView } from '@/components/admin/rentals/rentals-view';
import { ErrorState } from '@/components/ui/error-state';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Rentals' };

export default async function RentalsPage() {
  const supabase = await createClient();
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <ErrorState title="Could not load rentals" message={error.message} />;

  return <RentalsView rentals={rentals ?? []} />;
}
