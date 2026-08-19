import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { RentalStatusBadge } from '@/components/admin/rentals/rental-status-badge';
import { formatDate, isRentalOverdue } from '@/components/admin/rentals/rental-utils';
import { cn } from '@/lib/utils';
import type { ItemRental } from './item-rental-types';

/** One rental line rendered as a scannable row */
export function ItemRentalRow({ rental }: { rental: ItemRental }) {
  const overdue = isRentalOverdue(rental);
  const outstanding = Math.max(rental.quantity - rental.returned_quantity, 0);

  return (
    <Link
      href={`/admin/rentals/${rental.id}`}
      className={cn(
        'flex items-center gap-2.5 border-b border-line px-3 py-2 transition-colors last:border-b-0 hover:bg-surface-300',
        overdue && 'bg-red-950/20',
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface-300 font-mono text-xs font-semibold text-fg">
        {outstanding || rental.quantity}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-fg">{rental.renter_name}</p>
        <p className="mt-px flex flex-wrap items-center gap-x-1.5 text-[11px] text-fg-subtle">
          <span>Out {formatDate(rental.rented_at) ?? '—'}</span>
          <span aria-hidden>·</span>
          <span className={overdue ? 'inline-flex items-center gap-1 text-red-400' : undefined}>
            {overdue && <TriangleAlert className="h-3 w-3" />}
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
