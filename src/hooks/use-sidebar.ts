'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'admin:sidebar-collapsed';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

const getCollapsedSnapshot = () => window.localStorage.getItem(STORAGE_KEY) === 'true';
// The server has no access to the persisted preference, so it always renders expanded
const getCollapsedServerSnapshot = () => false;

function setCollapsed(value: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(value));
  listeners.forEach((listener) => listener());
}

export type UseSidebarResult = {
  /** Desktop: sidebar shrinked to an icon-only rail */
  isCollapsed: boolean;
  /** Mobile: off-canvas drawer visibility */
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

export function useSidebar(): UseSidebarResult {
  const isCollapsed = useSyncExternalStore(
    subscribe,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed(!getCollapsedSnapshot()), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile };
}
