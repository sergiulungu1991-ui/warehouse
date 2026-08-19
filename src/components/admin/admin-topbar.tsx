'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Warehouse',
  items: 'Items',
  categories: 'Categories',
  rentals: 'Rentals',
  users: 'Users',
  add: 'Add',
  edit: 'Edit',
};

const humanize = (segment: string) =>
  SEGMENT_LABELS[segment] ?? (/^\d+$/.test(segment) ? `#${segment}` : segment);

/** Derives breadcrumbs from the URL so no page has to pass them manually */
function useBreadcrumbs(): Crumb[] {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => ({
    label: humanize(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }));
}

export function AdminTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const crumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-line bg-surface-100 px-2">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-300 hover:text-fg lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1 truncate">
        <Breadcrumbs items={crumbs} />
      </div>

      <ThemeToggle />
    </header>
  );
}
