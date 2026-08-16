'use client';

import { Icon } from '@/components/ui/icon';
import { ADMIN_NAV_ITEMS, BACK_TO_SITE_ITEM } from './admin-nav-items';
import { SidebarNavLink } from './sidebar-nav-link';

type AdminSidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width,transform] duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900 ${
        isMobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'
      } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
    >
      <div
        className={`flex h-16 items-center gap-2 px-4 ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}
      >
        <div className={`flex min-w-0 items-center gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
            <Icon name="box" className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Warehouse
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          className="hidden rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 lg:flex dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Icon name={isCollapsed ? 'expand' : 'collapse'} />
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Icon name="close" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p
          className={`px-3 pb-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600 ${
            isCollapsed ? 'lg:hidden' : ''
          }`}
        >
          Manage
        </p>
        {ADMIN_NAV_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            onNavigate={onCloseMobile}
          />
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <SidebarNavLink
          item={BACK_TO_SITE_ITEM}
          isCollapsed={isCollapsed}
          onNavigate={onCloseMobile}
        />
      </div>
    </aside>
  );
}
