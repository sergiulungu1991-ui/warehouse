'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Warehouse } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { APP_RAIL_ITEMS } from './admin-nav-items';

/** Narrow icon-only rail: the outermost level of navigation */
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden w-12 shrink-0 flex-col items-center border-r border-line bg-surface-100 lg:flex">
      <Link
        href="/admin/items"
        aria-label="Warehouse home"
        className="flex h-12 w-full items-center justify-center border-b border-line text-accent"
      >
        <Warehouse className="h-4 w-4" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1 py-2">
        {APP_RAIL_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'bg-surface-400 text-fg'
                  : 'text-fg-subtle hover:bg-surface-300 hover:text-fg',
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        title="Log out"
        aria-label="Log out"
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-300 hover:text-fg"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </aside>
  );
}
