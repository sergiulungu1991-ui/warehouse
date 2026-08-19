import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from('categories').select('name').eq('id', id).single();
  return { title: data ? `Edit ${data.name}` : 'Edit category' };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const [category, categories] = await Promise.all([
    supabase.from('categories').select('*').eq('id', id).single(),
    supabase.from('categories').select('*'),
  ]);

  if (!category.data) notFound();

  return (
    <PageContainer narrow>
      <PageHeader title={`Edit ${category.data.name}`} />
      <CategoryForm categories={categories.data ?? []} category={category.data} />
    </PageContainer>
  );
}
