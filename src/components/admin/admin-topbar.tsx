'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Icon } from '@/components/ui/icon';

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  items: 'Items',
  categories: 'Categories',
  rentals: 'Rentals',
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950/80">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 lg:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1 truncate">
        <Breadcrumbs items={crumbs} />
      </div>

      <ThemeToggle />
    </header>
  );
}
