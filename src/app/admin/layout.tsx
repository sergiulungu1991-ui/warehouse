'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { useSidebar } from '@/hooks/use-sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={closeMobile}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={toggleMobile} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
