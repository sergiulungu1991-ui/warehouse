import type { ReactNode } from 'react';
import { Icon, type IconName } from './icon';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon = 'box',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Icon name={icon} className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
      </div>
      <h3 className="mb-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {action}
    </div>
  );
}
