'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useItemFilters } from '@/hooks/use-item-filters';
import type { ItemWithRelations } from '@/lib/items-data';
import type { Category } from '@/types';
import { ItemsFilters } from './items-filters';
import { ItemsTable } from './items-table';
import { ItemCard } from './item-card';
import { Card } from '@/components/ui/card';
import { ButtonLink, Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { EmptyState } from '@/components/ui/empty-state';

type ViewMode = 'table' | 'card';

const VIEW_OPTIONS = [
  { value: 'table' as const, label: 'Table' },
  { value: 'card' as const, label: 'Cards' },
];

type ItemsListProps = {
  items: ItemWithRelations[];
  categories: Category[];
};

export function ItemsList({ items, categories }: ItemsListProps) {
  const router = useRouter();
  const filters = useItemFilters(items, categories);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Server component owns the data, so a route refresh is the way to reload it
  const reload = () => router.refresh();

  return (
    <>
      <ItemsFilters
        query={filters.query}
        onQueryChange={filters.setQuery}
        categoryId={filters.categoryId}
        onCategoryChange={filters.setCategoryId}
        availability={filters.availability}
        onAvailabilityChange={filters.setAvailability}
        categoryOptions={filters.categoryOptions}
        isFiltered={filters.isFiltered}
        onReset={filters.resetFilters}
        resultCount={filters.filteredItems.length}
        totalCount={items.length}
        leading={
          <SegmentedControl
            aria-label="Change items layout"
            value={viewMode}
            options={VIEW_OPTIONS}
            onChange={setViewMode}
          />
        }
        trailing={
          <ButtonLink href="/admin/items/add" icon="plus" size="sm">
            Add Item
          </ButtonLink>
        }
      />

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon="box"
            title="No items yet"
            description="Get started by adding your first item to the inventory."
            action={
              <ButtonLink href="/admin/items/add" icon="plus" size="sm">
                Add first item
              </ButtonLink>
            }
          />
        </Card>
      ) : filters.filteredItems.length === 0 ? (
        <Card>
          <EmptyState
            icon="search"
            title="No items match your filters"
            description="Try a different search term or pick another category."
            action={
              <Button variant="secondary" size="sm" onClick={filters.resetFilters}>
                Reset filters
              </Button>
            }
          />
        </Card>
      ) : viewMode === 'table' ? (
        <ItemsTable items={filters.filteredItems} onItemDeleted={reload} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filters.filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
