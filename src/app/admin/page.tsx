import { Boxes, Calendar, Package, Tags, TriangleAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/stat-card';
import { QuickActionCard } from '@/components/admin/quick-action-card';
import { PageContainer } from '@/components/ui/page-container';
import { SectionLabel } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { isRentalOverdue } from '@/components/admin/rentals/rental-utils';

// Admin data must never be served from the build-time snapshot
export const dynamic = 'force-dynamic';

const QUICK_ACTIONS = [
  {
    href: '/admin/items/add',
    title: 'Add item',
    description: 'Register a new product in the inventory',
    icon: Package,
  },
  {
    href: '/admin/categories/add',
    title: 'Add category',
    description: 'Extend the category hierarchy',
    icon: Tags,
  },
  {
    href: '/admin/rentals/add',
    title: 'Add rental',
    description: 'Check equipment out of the warehouse',
    icon: Calendar,
  },
] as const;

export default async function AdminOverview() {
  const supabase = await createClient();
  const [categories, itemRows, rentals] = await Promise.all([
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('items').select('id', { count: 'exact', head: true }),
    supabase.from('rentals').select('*'),
  ]);

  const failure = categories.error ?? itemRows.error ?? rentals.error;
  const allRentals = rentals.data ?? [];
  const active = allRentals.filter(
    (rental) => rental.status === 'Active' || rental.status === 'Overdue',
  );
  const overdue = active.filter(isRentalOverdue);

  return (
    <PageContainer>
      {failure && (
        <div className="mb-3">
          <ErrorState title="Could not load overview data" message={failure.message} />
        </div>
      )}

      <SectionLabel>Inventory</SectionLabel>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatCard href="/admin/items" label="Items" value={itemRows.count ?? 0} icon={Boxes} />
        <StatCard
          href="/admin/categories"
          label="Categories"
          value={categories.count ?? 0}
          icon={Tags}
        />
        <StatCard
          href="/admin/rentals"
          label="Active rentals"
          value={active.length}
          icon={Calendar}
          tone="accent"
        />
        <StatCard
          href="/admin/rentals"
          label="Overdue"
          value={overdue.length}
          icon={TriangleAlert}
          tone={overdue.length > 0 ? 'danger' : 'default'}
          hint={overdue.length > 0 ? 'Needs attention' : 'All on schedule'}
        />
      </div>

      <SectionLabel>Quick actions</SectionLabel>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.href} {...action} />
        ))}
      </div>
    </PageContainer>
  );
}
