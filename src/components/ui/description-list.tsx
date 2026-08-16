import type { ReactNode } from 'react';

export type DescriptionItem = {
  label: string;
  value: ReactNode;
};

/** Read-only key/value layout used by every detail page */
export function DescriptionList({ items }: { items: DescriptionItem[] }) {
  return (
    <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-50">
            {item.value ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
