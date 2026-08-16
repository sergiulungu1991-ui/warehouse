import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: Crumb[];
};

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-4">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl dark:text-zinc-50">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
