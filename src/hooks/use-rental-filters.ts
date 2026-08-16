'use client';

import { useMemo, useState } from 'react';
import { isRentalOverdue, RENTAL_STATUSES } from '@/components/admin/rentals/rental-utils';
import type { Rental } from '@/types';

export const ALL_STATUSES = 'all';
/** Virtual status: derived from the due date, not stored in the row */
export const OVERDUE_FILTER = 'overdue';

type UseRentalFiltersResult = {
  query: string;
  setQuery: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  statusOptions: string[];
  filteredRentals: Rental[];
  isFiltered: boolean;
  resetFilters: () => void;
};

const matchesQuery = (rental: Rental, query: string) =>
  [rental.renter_name, rental.renter_phone, rental.renter_email].some((field) =>
    field?.toLowerCase().includes(query),
  );

const matchesStatus = (rental: Rental, status: string) => {
  if (status === ALL_STATUSES) return true;
  if (status === OVERDUE_FILTER) return rental.status === 'Overdue' || isRentalOverdue(rental);
  return rental.status === status;
};

export function useRentalFilters(rentals: Rental[]): UseRentalFiltersResult {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>(ALL_STATUSES);

  // Known statuses plus any extra value already stored in the data
  const statusOptions = useMemo(
    () => [...new Set<string>([...RENTAL_STATUSES, ...rentals.map((rental) => rental.status)])],
    [rentals],
  );

  const filteredRentals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rentals.filter(
      (rental) => matchesStatus(rental, status) && (!normalized || matchesQuery(rental, normalized)),
    );
  }, [rentals, query, status]);

  const resetFilters = () => {
    setQuery('');
    setStatus(ALL_STATUSES);
  };

  return {
    query,
    setQuery,
    status,
    setStatus,
    statusOptions,
    filteredRentals,
    isFiltered: query.trim().length > 0 || status !== ALL_STATUSES,
    resetFilters,
  };
}
