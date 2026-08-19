'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { ModuleSidebar } from '@/components/admin/module-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { useSidebar } from '@/hooks/use-sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-100">
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={closeMobile} />
      )}

      <AppSidebar />

      <ModuleSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={closeMobile}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={toggleMobile} />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
