import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { RentalStatusBadge } from '@/components/admin/rentals/rental-status-badge';
import { formatDate, isRentalOverdue } from '@/components/admin/rentals/rental-utils';
import type { ItemRental } from './item-rental-types';

/** One rental line rendered as a scannable card row instead of a dense table cell */
export function ItemRentalRow({ rental }: { rental: ItemRental }) {
  const overdue = isRentalOverdue(rental);
  const outstanding = Math.max(rental.quantity - rental.returned_quantity, 0);

  return (
    <Link
      href={`/admin/rentals/${rental.id}`}
      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
        overdue
          ? 'border-red-200 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20'
          : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        {outstanding || rental.quantity}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {rental.renter_name}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Out {formatDate(rental.rented_at) ?? '—'}</span>
          <span aria-hidden>·</span>
          <span className={overdue ? 'inline-flex items-center gap-1 text-red-600 dark:text-red-400' : ''}>
            {overdue && <Icon name="alert" className="h-3 w-3" />}
            Due {formatDate(rental.expected_return_at) ?? '—'}
          </span>
          {rental.returned_at && (
            <>
              <span aria-hidden>·</span>
              <span>Back {formatDate(rental.returned_at)}</span>
            </>
          )}
        </p>
      </div>

      <RentalStatusBadge status={rental.status} overdue={overdue} />
    </Link>
  );
}
