import type { IconName } from '@/components/ui/icon';

export type AdminNavItem = {
  href: string;
  label: string;
  icon: IconName;
  /** Match the route only on an exact pathname (used for index routes) */
  exact?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin/items', label: 'Items', icon: 'box', exact: true },
  { href: '/admin/categories', label: 'Categories', icon: 'tag' },
  { href: '/admin/rentals', label: 'Rentals', icon: 'calendar' },
];
