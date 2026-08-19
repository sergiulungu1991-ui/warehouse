'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Search, TriangleAlert } from 'lucide-react';
import type { Rental } from '@/types';
import {
  ALL_STATUSES,
  OVERDUE_FILTER,
  useRentalFilters,
} from '@/hooks/use-rental-filters';
import { useTableSort } from '@/hooks/use-table-sort';
import { Button, ButtonLink } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/form-controls';
import { TableToolbar } from '@/components/ui/table-toolbar';
import { FilterDropdown, type FilterOption } from '@/components/ui/filter-dropdown';
import { DataTable, type Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { RentalStatusBadge } from './rental-status-badge';
import { RentalRowActions } from './rental-row-actions';
import { RentalDetailPanel } from './rental-detail-panel';
import { formatDate, isRentalOverdue } from './rental-utils';

export function RentalsView({ rentals }: { rentals: Rental[] }) {
  const router = useRouter();
  const filters = useRentalFilters(rentals);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sort = useTableSort<Rental>('rented_at');
  const rows = useMemo(() => sort.apply(filters.filteredRentals), [sort, filters.filteredRentals]);
  const selected = rows.find((rental) => String(rental.id) === selectedId) ?? null;

  const statusOptions: FilterOption[] = [
    { value: ALL_STATUSES, label: 'All statuses' },
    { value: OVERDUE_FILTER, label: 'Overdue (derived)' },
    ...filters.statusOptions.map((status) => ({ value: status, label: status })),
  ];

  const reload = () => router.refresh();

  const columns: Column<Rental>[] = [
    {
      id: 'renter_name',
      header: 'Renter',
      sortable: true,
      cell: (rental) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-fg">{rental.renter_name}</p>
          {rental.renter_email && (
            <p className="hidden max-w-xs truncate text-[11px] text-fg-subtle lg:block">
              {rental.renter_email}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'renter_phone',
      header: 'Phone',
      hideBelow: 'md',
      cell: (rental) => <span className="text-fg-muted">{rental.renter_phone || '—'}</span>,
    },
    {
      id: 'rented_at',
      header: 'Rented',
      sortable: true,
      hideBelow: 'sm',
      cell: (rental) => (
        <span className="whitespace-nowrap text-fg-muted">
          {formatDate(rental.rented_at) ?? '—'}
        </span>
      ),
    },
    {
      id: 'expected_return_at',
      header: 'Due',
      sortable: true,
      hideBelow: 'lg',
      cell: (rental) => {
        const overdue = isRentalOverdue(rental);
        return (
          <span
            className={
              overdue
                ? 'inline-flex items-center gap-1 whitespace-nowrap text-red-400'
                : 'whitespace-nowrap text-fg-muted'
            }
          >
            {overdue && <TriangleAlert className="h-3 w-3" />}
            {formatDate(rental.expected_return_at) ?? '—'}
          </span>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      width: 'w-28',
      cell: (rental) => (
        <RentalStatusBadge status={rental.status} overdue={isRentalOverdue(rental)} />
      ),
    },
    {
      id: 'actions',
      header: '',
      width: 'w-10',
      align: 'right',
      cell: (rental) => (
        <RentalRowActions
          rentalId={String(rental.id)}
          renterName={rental.renter_name}
          onDeleted={reload}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <TableToolbar
          resultCount={rows.length}
          totalCount={rentals.length}
          action={
            <ButtonLink href="/admin/rentals/add" icon={Plus} size="sm">
              Add rental
            </ButtonLink>
          }
        >
          <SearchInput
            value={filters.query}
            onValueChange={filters.setQuery}
            placeholder="Search renters..."
            aria-label="Search rentals"
            className="w-40 sm:w-56"
          />

          <FilterDropdown
            label="Status"
            icon={Calendar}
            value={filters.status}
            options={statusOptions}
            onChange={filters.setStatus}
            neutralValue={ALL_STATUSES}
          />

          {filters.isFiltered && (
            <Button variant="ghost" size="sm" onClick={filters.resetFilters}>
              Reset
            </Button>
          )}
        </TableToolbar>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {rentals.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No rentals yet"
              description="Register the first rental to start tracking equipment leaving the warehouse."
              action={
                <ButtonLink href="/admin/rentals/add" icon={Plus} size="sm">
                  Add rental
                </ButtonLink>
              }
            />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No rentals match your filters"
              description="Try a different search term or status."
              action={
                <Button variant="secondary" size="sm" onClick={filters.resetFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(rental) => String(rental.id)}
              onRowClick={(rental) => setSelectedId(String(rental.id))}
              activeRowKey={selectedId ?? undefined}
              sortBy={sort.sortBy}
              sortDirection={sort.direction}
              onSortChange={sort.toggle}
            />
          )}
        </div>
      </div>

      {selected && (
        <RentalDetailPanel
          rental={selected}
          onClose={() => setSelectedId(null)}
          onDeleted={reload}
        />
      )}
    </div>
  );
}
