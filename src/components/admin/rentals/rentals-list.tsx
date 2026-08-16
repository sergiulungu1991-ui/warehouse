'use client';

import type { Rental } from '@/types';
import { useRentalFilters } from '@/hooks/use-rental-filters';
import { Card } from '@/components/ui/card';
import { ButtonLink, Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RentalsFilters } from './rentals-filters';
import { RentalsTable } from './rentals-table';

export function RentalsList({ rentals }: { rentals: Rental[] }) {
  const filters = useRentalFilters(rentals);

  return (
    <>
      <RentalsFilters
        query={filters.query}
        onQueryChange={filters.setQuery}
        status={filters.status}
        onStatusChange={filters.setStatus}
        statusOptions={filters.statusOptions}
        isFiltered={filters.isFiltered}
        onReset={filters.resetFilters}
        resultCount={filters.filteredRentals.length}
        totalCount={rentals.length}
        trailing={
          <ButtonLink href="/admin/rentals/add" icon="plus" size="sm">
            Add Rental
          </ButtonLink>
        }
      />

      {rentals.length === 0 ? (
        <Card>
          <EmptyState
            icon="calendar"
            title="No rentals yet"
            description="Get started by registering your first rental."
            action={
              <ButtonLink href="/admin/rentals/add" icon="plus" size="sm">
                Add first rental
              </ButtonLink>
            }
          />
        </Card>
      ) : filters.filteredRentals.length === 0 ? (
        <Card>
          <EmptyState
            icon="search"
            title="No rentals match your filters"
            description="Try a different search term or status."
            action={
              <Button variant="secondary" size="sm" onClick={filters.resetFilters}>
                Reset filters
              </Button>
            }
          />
        </Card>
      ) : (
        <RentalsTable rentals={filters.filteredRentals} />
      )}
    </>
  );
}
