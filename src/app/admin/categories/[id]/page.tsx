import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pencil, Plus, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DetailRow } from '@/components/ui/detail-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemQuantityBadge } from '@/components/admin/item-quantity-badge';
import { formatDate } from '@/components/admin/rentals/rental-utils';
import { getAvailableByItemIds, calculateAvailable } from '@/lib/item-availability';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function loadCategory(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').eq('id', id).single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await loadCategory(id);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryViewPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const category = await loadCategory(id);
  if (!category) notFound();

  const [parent, children, items] = await Promise.all([
    category.parent_id
      ? supabase.from('categories').select('id, name').eq('id', category.parent_id).single()
      : Promise.resolve({ data: null }),
    supabase.from('categories').select('*').eq('parent_id', id).order('name'),
    supabase.from('items').select('id, name, quantity').eq('category_id', id).order('name'),
  ]);

  const childCategories = children.data ?? [];
  const categoryItems = items.data ?? [];
  const itemIds = categoryItems.map((item) => item.id);
  const rentedByItem = await getAvailableByItemIds(itemIds);
  const itemsWithAvailability = categoryItems.map((item) => ({
    ...item,
    available: calculateAvailable(item.quantity, rentedByItem[item.id] ?? 0),
  }));

  return (
    <PageContainer>
      <PageHeader
        title={category.name}
        description={category.description ?? undefined}
        actions={
          <ButtonLink href={`/admin/categories/${category.id}/edit`} icon={Pencil} size="sm">
            Edit
          </ButtonLink>
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Details" />
          <div>
            <DetailRow label="Parent category">
              {parent.data ? (
                <Link
                  href={`/admin/categories/${parent.data.id}`}
                  className="text-accent-text hover:underline"
                >
                  {parent.data.name}
                </Link>
              ) : (
                'Root category'
              )}
            </DetailRow>
            <DetailRow label="Description">{category.description || '—'}</DetailRow>
            <DetailRow label="Created">{formatDate(category.created_at) ?? '—'}</DetailRow>
            <DetailRow label="Last updated">{formatDate(category.updated_at) ?? '—'}</DetailRow>
          </div>
        </Card>

        <Card>
          <CardHeader title="Statistics" />
          <CardBody className="grid grid-cols-2 gap-2">
            <Stat label="Items" value={categoryItems.length} />
            <Stat label="Subcategories" value={childCategories.length} />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-3">
        <CardHeader
          title="Subcategories"
          description={`${childCategories.length} direct children`}
          actions={
            <ButtonLink href="/admin/categories/add" variant="secondary" size="sm" icon={Plus}>
              Add
            </ButtonLink>
          }
        />
        {childCategories.length > 0 ? (
          <CardBody className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/admin/categories/${child.id}`}
                className="rounded-md border border-line bg-surface-300 p-2 transition-colors hover:border-line-strong"
              >
                <p className="truncate text-xs font-medium text-fg">{child.name}</p>
                {child.description && (
                  <p className="truncate text-[11px] text-fg-subtle">{child.description}</p>
                )}
              </Link>
            ))}
          </CardBody>
        ) : (
          <EmptyState
            icon={Tag}
            title="No subcategories"
            description="This category has no children yet."
          />
        )}
      </Card>

      <Card className="mt-3">
        <CardHeader
          title="Items in this category"
          description={`${categoryItems.length} items`}
          actions={
            <ButtonLink href="/admin/items/add" variant="secondary" size="sm" icon={Plus}>
              Add item
            </ButtonLink>
          }
        />
        {itemsWithAvailability.length > 0 ? (
          <div>
            {itemsWithAvailability.map((item) => (
              <Link
                key={item.id}
                href={`/admin/items/${item.id}`}
                className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 transition-colors last:border-b-0 hover:bg-surface-300"
              >
                <span className="truncate text-xs font-medium text-fg">{item.name}</span>
                <ItemQuantityBadge available={item.available} total={item.quantity} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items"
            description="Nothing is assigned to this category yet."
            action={
              <ButtonLink href="/admin/items/add" icon={Plus} size="sm">
                Add item
              </ButtonLink>
            }
          />
        )}
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface-300 p-2">
      <p className="text-[11px] text-fg-subtle">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-fg">{value}</p>
    </div>
  );
}
