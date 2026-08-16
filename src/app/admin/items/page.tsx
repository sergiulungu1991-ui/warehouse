import type { Metadata } from 'next';
import { fetchItemsSnapshot } from '@/lib/items-data';
import { ItemsList } from '@/components/admin/items-list';
import { PageContainer } from '@/components/ui/page-container';
import { ErrorState } from '@/components/ui/error-state';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Items' };

export default async function ItemsPage() {
  const { items, categories, error } = await fetchItemsSnapshot();

  return (
    <PageContainer fullWidth>
      {error ? (
        <ErrorState title="Could not load items" message={error} />
      ) : (
        <ItemsList items={items} categories={categories} />
      )}
    </PageContainer>
  );
}
