import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import type { Rental } from '@/types';
import { RentalStatusBadge } from './rental-status-badge';
import { RentalRowActions } from './rental-row-actions';
import { formatDate, isRentalOverdue } from './rental-utils';

const HEADERS = [
  { label: 'Renter', className: '' },
  { label: 'Phone', className: 'hidden sm:table-cell' },
  { label: 'Rented', className: 'hidden md:table-cell' },
  { label: 'Expected return', className: 'hidden lg:table-cell' },
  { label: 'Status', className: '' },
  { label: 'Actions', className: 'text-right' },
];

export function RentalsTable({ rentals }: { rentals: Rental[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header.label}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 lg:px-6 dark:text-zinc-400 ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {rentals.map((rental) => (
              <RentalRow key={rental.id} rental={rental} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CELL = 'whitespace-nowrap px-4 py-3 text-sm text-zinc-700 lg:px-6 dark:text-zinc-300';

function RentalRow({ rental }: { rental: Rental }) {
  const overdue = isRentalOverdue(rental);

  return (
    <tr
      className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
        overdue ? 'bg-red-50/60 dark:bg-red-950/30' : ''
      }`}
    >
      <td className="px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <Link
            href={`/admin/rentals/${rental.id}`}
            className="block truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
          >
            {rental.renter_name}
          </Link>
          {rental.renter_email && (
            <p className="hidden max-w-xs truncate text-sm text-zinc-500 lg:block dark:text-zinc-400">
              {rental.renter_email}
            </p>
          )}
        </div>
      </td>
      <td className={`hidden sm:table-cell ${CELL}`}>{rental.renter_phone || '—'}</td>
      <td className={`hidden md:table-cell ${CELL}`}>{formatDate(rental.rented_at) ?? '—'}</td>
      <td className={`hidden lg:table-cell ${CELL}`}>
        <span className={overdue ? 'inline-flex items-center gap-1 text-red-600 dark:text-red-400' : ''}>
          {overdue && <Icon name="alert" className="h-4 w-4" />}
          {formatDate(rental.expected_return_at) ?? '—'}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 lg:px-6">
        <RentalStatusBadge status={rental.status} overdue={overdue} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 lg:px-6">
        <RentalRowActions rentalId={rental.id} renterName={rental.renter_name} />
      </td>
    </tr>
  );
}
