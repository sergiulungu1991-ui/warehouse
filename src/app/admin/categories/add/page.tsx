import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Add category' };

export default async function AddCategoryPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <PageContainer>
      <PageHeader
        title="Add category"
        description="Create a new category or subcategory"
        breadcrumbs={[{ label: 'Categories', href: '/admin/categories' }, { label: 'Add' }]}
      />
      <CategoryForm categories={categories ?? []} />
    </PageContainer>
  );
}
