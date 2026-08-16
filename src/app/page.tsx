import { supabase } from '@/lib/supabase';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const dynamic = 'force-dynamic';

const FEATURES: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'tag',
    title: 'Nested categories',
    description: 'Organise stock in a parent → child hierarchy that mirrors your warehouse.',
  },
  {
    icon: 'box',
    title: 'Item tracking',
    description: 'Photos, brands, models and per-unit inventory codes for every product.',
  },
  {
    icon: 'calendar',
    title: 'Rentals',
    description: 'Know what left the warehouse, who took it and when it is due back.',
  },
];

export default async function Home() {
  const [categories, items] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('items').select('*', { count: 'exact', head: true }),
  ]);

  const isConnected = !categories.error && !items.error;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
            <Icon name="box" className="h-4 w-4" />
          </span>
          Warehouse
        </span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 lg:py-24">
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            isConnected
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          {isConnected ? 'Database connected' : 'Database unreachable'}
        </span>

        <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Everything in your warehouse, in one place.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Track inventory, organise categories and manage rentals from a single admin panel.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/admin" icon="dashboard">
            Open admin dashboard
          </ButtonLink>
          <ButtonLink href="/admin/items" variant="secondary" icon="box">
            Browse items
          </ButtonLink>
        </div>

        {isConnected ? (
          <dl className="mt-12 flex gap-10">
            <Stat label="Categories" value={categories.count ?? 0} />
            <Stat label="Items" value={items.count ?? 0} />
          </dl>
        ) : (
          <p className="mt-12 text-sm text-red-600 dark:text-red-400">
            Check the Supabase credentials in your <code>.env.local</code> file.
          </p>
        )}

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Icon name={feature.icon} className="h-4 w-4" />
              </span>
              <h2 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-sm text-zinc-500 dark:text-zinc-500">
        Warehouse Management System
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</dd>
    </div>
  );
}
