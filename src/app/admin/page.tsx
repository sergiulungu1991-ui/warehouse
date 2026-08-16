import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/stat-card';
import { QuickActionCard } from '@/components/admin/quick-action-card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContainer } from '@/components/ui/page-container';
import { ErrorState } from '@/components/ui/error-state';

// Admin data must never be served from the build-time snapshot
export const dynamic = 'force-dynamic';

const QUICK_ACTIONS = [
  {
    href: '/admin/items/add',
    title: 'Add New Item',
    description: 'Create a new item in inventory',
    icon: 'plus',
    tone: 'green',
  },
  {
    href: '/admin/categories/add',
    title: 'Add Category',
    description: 'Create a new category',
    icon: 'tag',
    tone: 'blue',
  },
  {
    href: '/admin/rentals/add',
    title: 'Add Rental',
    description: 'Create a new rental agreement',
    icon: 'calendar',
    tone: 'purple',
  },
] as const;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [categories, itemRows, rentals] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('items').select('category_id'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }),
  ]);

  const failure = categories.error ?? itemRows.error ?? rentals.error;

  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Overview of your warehouse inventory" />

      {failure && (
        <div className="mb-6">
          <ErrorState title="Could not load dashboard data" message={failure.message} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <StatCard
          href="/admin/categories"
          label="Categories"
          value={categories.data?.length ?? 0}
          icon="tag"
          tone="blue"
        />
        <StatCard
          href="/admin/items"
          label="Items"
          value={itemRows.data?.length ?? 0}
          icon="box"
          tone="green"
        />
        <StatCard
          href="/admin/rentals"
          label="Active Rentals"
          value={rentals.count ?? 0}
          icon="calendar"
          tone="purple"
        />
      </div>

      <section className="mt-6 lg:mt-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 lg:text-xl dark:text-zinc-50">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard key={action.href} {...action} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
