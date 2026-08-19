'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_GROUPS, type AdminNavItem } from './admin-nav-items';

type ModuleSidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

function NavLink({
  item,
  isCollapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  isCollapsed: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const { href, label, icon: Icon, exact } = item;
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={isCollapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-7 items-center gap-2 rounded-md px-2 text-xs transition-colors',
        isCollapsed && 'lg:justify-center lg:px-0',
        isActive
          ? 'bg-surface-400 font-medium text-fg'
          : 'text-fg-muted hover:bg-surface-300 hover:text-fg',
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className={cn('truncate', isCollapsed && 'lg:hidden')}>{label}</span>
    </Link>
  );
}

export function ModuleSidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: ModuleSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-56 shrink-0 flex-col border-r border-line bg-surface-200 transition-[width,transform] duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'lg:w-12' : 'lg:w-52',
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-2">
        <span
          className={cn(
            'truncate px-1 text-xs font-semibold text-fg',
            isCollapsed && 'lg:hidden',
          )}
        >
          Warehouse
        </span>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className="hidden h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-300 hover:text-fg lg:flex"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-300 hover:text-fg lg:hidden"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-3">
            <p
              className={cn(
                'px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle',
                isCollapsed && 'lg:hidden',
              )}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  onNavigate={onCloseMobile}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
