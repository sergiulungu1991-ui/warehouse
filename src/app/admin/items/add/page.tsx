import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ItemForm } from '@/components/admin/items/item-form';
import { PageContainer } from '@/components/ui/page-container';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Add item' };

export default async function AddItemPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <PageContainer fullWidth>
      <ItemForm categories={categories ?? []} />
    </PageContainer>
  );
}
