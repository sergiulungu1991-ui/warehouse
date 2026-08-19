import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ItemForm } from '@/components/admin/items/item-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Add item' };

export default async function AddItemPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <PageContainer narrow>
      <PageHeader title="Add item" description="Register a new product in the inventory" />
      <ItemForm categories={categories ?? []} />
    </PageContainer>
  );
}
