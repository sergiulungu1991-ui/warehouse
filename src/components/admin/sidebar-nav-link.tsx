'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import type { AdminNavItem } from './admin-nav-items';

type SidebarNavLinkProps = {
  item: AdminNavItem;
  isCollapsed: boolean;
  onNavigate: () => void;
};

export function SidebarNavLink({ item, isCollapsed, onNavigate }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        isCollapsed ? 'lg:justify-center lg:px-0' : ''
      } ${
        isActive
          ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50'
      }`}
    >
      <Icon name={item.icon} className="h-5 w-5 shrink-0" />
      <span className={isCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
    </Link>
  );
}
