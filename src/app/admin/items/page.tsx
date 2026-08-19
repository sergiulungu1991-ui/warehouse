import type { Metadata } from 'next';
import { fetchItemsSnapshot } from '@/lib/items-data';
import { ItemsView } from '@/components/admin/items/items-view';
import { ErrorState } from '@/components/ui/error-state';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Items' };

export default async function ItemsPage() {
  const { items, categories, error } = await fetchItemsSnapshot();

  if (error) return <ErrorState title="Could not load items" message={error} />;

  return <ItemsView items={items} categories={categories} />;
}
