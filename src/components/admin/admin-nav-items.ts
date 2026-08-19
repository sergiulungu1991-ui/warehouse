import { Boxes, Calendar, LayoutDashboard, Package, Tags, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match the route only on an exact pathname (used for index routes) */
  exact?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

/** Icon-only rail entries: the top level areas of the app */
export const APP_RAIL_ITEMS: AdminNavItem[] = [
  { href: '/admin/items', label: 'Inventory', icon: Boxes },
  { href: '/admin/rentals', label: 'Rentals', icon: Calendar },
];

/** Grouped navigation rendered in the secondary sidebar */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Manage',
    items: [
      { href: '/admin/items', label: 'Items', icon: Package, exact: true },
      { href: '/admin/categories', label: 'Categories', icon: Tags },
      { href: '/admin/rentals', label: 'Rentals', icon: Calendar },
    ],
  },
  {
    label: 'Configuration',
    items: [{ href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'Settings',
    items: [{ href: '/admin/users', label: 'Users', icon: Users, exact: true }],
  },
];

/** Flat list kept for route matching and mobile drawers */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items);
