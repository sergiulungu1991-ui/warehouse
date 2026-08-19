import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

/** Compact page title row; breadcrumbs live in the topbar */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-fg">{title}</h1>
        {description && <p className="mt-0.5 text-[11px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{actions}</div>}
    </header>
  );
}
