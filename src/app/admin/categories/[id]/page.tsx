import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DescriptionList } from '@/components/ui/description-list';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemQuantityBadge } from '@/components/admin/item-quantity-badge';
import { formatDate } from '@/components/admin/rentals/rental-utils';
import { getAvailableByItemIds, calculateAvailable } from '@/lib/item-availability';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function loadCategory(id: string) {
  const { data } = await supabase.from('categories').select('*').eq('id', id).single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await loadCategory(id);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryViewPage({ params }: PageProps) {
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
        breadcrumbs={[
          { label: 'Categories', href: '/admin/categories' },
          { label: category.name },
        ]}
        actions={
          <ButtonLink href={`/admin/categories/${category.id}/edit`} icon="edit">
            Edit
          </ButtonLink>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Details" />
          <CardBody>
            <DescriptionList
              items={[
                {
                  label: 'Parent category',
                  value: parent.data ? (
                    <Link
                      href={`/admin/categories/${parent.data.id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {parent.data.name}
                    </Link>
                  ) : (
                    'Root category'
                  ),
                },
                { label: 'Description', value: category.description || '—' },
                { label: 'Created', value: formatDate(category.created_at) },
                { label: 'Last updated', value: formatDate(category.updated_at) },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Statistics" />
          <CardBody className="grid grid-cols-2 gap-4">
            <Stat label="Items" value={categoryItems.length} />
            <Stat label="Subcategories" value={childCategories.length} />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Subcategories"
          description={`${childCategories.length} direct children`}
          actions={
            <ButtonLink href="/admin/categories/add" variant="secondary" size="sm" icon="plus">
              Add
            </ButtonLink>
          }
        />
        {childCategories.length > 0 ? (
          <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/admin/categories/${child.id}`}
                className="rounded-xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
              >
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {child.name}
                </p>
                {child.description && (
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {child.description}
                  </p>
                )}
              </Link>
            ))}
          </CardBody>
        ) : (
          <EmptyState
            icon="tag"
            title="No subcategories"
            description="This category has no children yet."
          />
        )}
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Items in this category"
          description={`${categoryItems.length} items`}
          actions={
            <ButtonLink href="/admin/items/add" variant="secondary" size="sm" icon="plus">
              Add item
            </ButtonLink>
          }
        />
        {itemsWithAvailability.length > 0 ? (
          <CardBody className="space-y-2">
            {itemsWithAvailability.map((item) => (
              <Link
                key={item.id}
                href={`/admin/items/${item.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
              >
                <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </span>
                <ItemQuantityBadge available={item.available} total={item.quantity} />
              </Link>
            ))}
          </CardBody>
        ) : (
          <EmptyState
            title="No items"
            description="Nothing is assigned to this category yet."
            action={
              <ButtonLink href="/admin/items/add" icon="plus" size="sm">
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
    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}
