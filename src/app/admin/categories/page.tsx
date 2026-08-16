import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { buildCategoryTree } from '@/lib/category-tree';
import { CategoryTree } from '@/components/admin/category-tree';
import { PageContainer } from '@/components/ui/page-container';
import { ErrorState } from '@/components/ui/error-state';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [categories, itemRows] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('items').select('category_id'),
  ]);

  const failure = categories.error ?? itemRows.error;
  const itemCountByCategory = (itemRows.data ?? []).reduce<Record<string, number>>((acc, item) => {
    acc[item.category_id] = (acc[item.category_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <PageContainer fullWidth>
      {failure ? (
        <ErrorState title="Could not load categories" message={failure.message} />
      ) : (
        <CategoryTree nodes={buildCategoryTree(categories.data ?? [], itemCountByCategory)} />
      )}
    </PageContainer>
  );
}
