import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ItemForm } from '@/components/admin/items/item-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from('items').select('name').eq('id', id).single();
  return { title: data ? `Edit ${data.name}` : 'Edit item' };
}

export default async function EditItemPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const [item, categories, images] = await Promise.all([
    supabase.from('items').select('*').eq('id', id).single(),
    supabase.from('categories').select('*'),
    supabase
      .from('item_images')
      .select('id, url, is_primary, sort_order')
      .eq('item_id', id)
      .order('sort_order'),
  ]);

  if (!item.data) notFound();

  const sortedImages = [...(images.data ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
    .map(({ id: imageId, url }) => ({ id: imageId, url }));

  return (
    <PageContainer narrow>
      <PageHeader title={`Edit ${item.data.name}`} />
      <ItemForm
        categories={categories.data ?? []}
        item={item.data}
        initialImages={sortedImages}
      />
    </PageContainer>
  );
}
