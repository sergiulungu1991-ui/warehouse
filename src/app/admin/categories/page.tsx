import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { buildCategoryTree } from '@/lib/category-tree';
import { CategoriesView } from '@/components/admin/categories/categories-view';
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
  if (failure) return <ErrorState title="Could not load categories" message={failure.message} />;

  const itemCountByCategory = (itemRows.data ?? []).reduce<Record<string, number>>((acc, item) => {
    const key = String(item.category_id);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return <CategoriesView nodes={buildCategoryTree(categories.data ?? [], itemCountByCategory)} />;
}
