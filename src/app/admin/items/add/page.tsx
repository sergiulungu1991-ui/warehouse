import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { ItemForm } from '@/components/admin/items/item-form';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Add item' };

export default async function AddItemPage() {
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <PageContainer>
      <PageHeader
        title="Add item"
        description="Register a new product in the inventory"
        breadcrumbs={[{ label: 'Items', href: '/admin/items' }, { label: 'Add' }]}
      />
      <ItemForm categories={categories ?? []} />
    </PageContainer>
  );
}
