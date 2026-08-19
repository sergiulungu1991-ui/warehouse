'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Boxes, LayoutGrid, Package, Plus, Rows3, SlidersHorizontal, Tags } from 'lucide-react';
import type { Category } from '@/types';
import type { ItemWithRelations } from '@/lib/items-data';
import {
  ALL_AVAILABILITY,
  ALL_CATEGORIES,
  AVAILABLE_AVAILABILITY,
  RENTED_AVAILABILITY,
  useItemFilters,
  type AvailabilityFilter,
} from '@/hooks/use-item-filters';
import { useTableSort } from '@/hooks/use-table-sort';
import { Button, ButtonLink } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/form-controls';
import { TableToolbar } from '@/components/ui/table-toolbar';
import { FilterDropdown, type FilterOption } from '@/components/ui/filter-dropdown';
import { DataTable, type Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ItemQuantityBadge } from '../item-quantity-badge';
import { ItemThumbnail } from './item-thumbnail';
import { ItemCard } from '../item-card';
import { ItemRowActions } from './item-row-actions';
import { ItemDetailPanel } from './item-detail-panel';

type ViewMode = 'table' | 'grid';

const VIEW_OPTIONS = [
  { value: 'table' as const, label: 'Table', icon: Rows3 },
  { value: 'grid' as const, label: 'Grid', icon: LayoutGrid },
];

const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: ALL_AVAILABILITY, label: 'All items' },
  { value: RENTED_AVAILABILITY, label: 'Rented out' },
  { value: AVAILABLE_AVAILABILITY, label: 'Available' },
];

/** Column ids that do not map directly onto an item property */
const SORT_ACCESSORS = {
  category: (item: ItemWithRelations) => item.categories?.name ?? null,
};

type ItemsViewProps = {
  items: ItemWithRelations[];
  categories: Category[];
};

export function ItemsView({ items, categories }: ItemsViewProps) {
  const router = useRouter();
  const filters = useItemFilters(items, categories);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sort = useTableSort<ItemWithRelations>('name', SORT_ACCESSORS);
  const rows = useMemo(() => sort.apply(filters.filteredItems), [sort, filters.filteredItems]);
  const selected = rows.find((item) => String(item.id) === selectedId) ?? null;

  const categoryOptions: FilterOption[] = [
    { value: ALL_CATEGORIES, label: 'All categories' },
    ...filters.categoryOptions.map(({ id, name, depth }) => ({ value: id, label: name, depth })),
  ];

  const reload = () => router.refresh();

  const columns: Column<ItemWithRelations>[] = [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <ItemThumbnail url={item.images[0]?.url} name={item.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">{item.name}</p>
            {item.description && (
              <p className="hidden max-w-xs truncate text-[11px] text-fg-subtle lg:block">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      sortable: true,
      hideBelow: 'sm',
      cell: (item) => <span className="text-fg-muted">{item.categories?.name || '—'}</span>,
    },
    {
      id: 'brand',
      header: 'Brand',
      sortable: true,
      hideBelow: 'md',
      cell: (item) => <span className="text-fg-muted">{item.brand || '—'}</span>,
    },
    {
      id: 'model',
      header: 'Model',
      hideBelow: 'lg',
      cell: (item) => <span className="text-fg-muted">{item.model || '—'}</span>,
    },
    {
      id: 'available',
      header: 'Stock',
      sortable: true,
      width: 'w-24',
      cell: (item) => <ItemQuantityBadge available={item.available} total={item.quantity} />,
    },
    {
      id: 'actions',
      header: '',
      width: 'w-10',
      align: 'right',
      cell: (item) => (
        <ItemRowActions itemId={String(item.id)} itemName={item.name} onDeleted={reload} />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <TableToolbar
          resultCount={rows.length}
          totalCount={items.length}
          action={
            <ButtonLink href="/admin/items/add" icon={Plus} size="sm">
              Add item
            </ButtonLink>
          }
        >
          <SegmentedControl
            aria-label="Change items layout"
            value={viewMode}
            options={VIEW_OPTIONS}
            onChange={setViewMode}
          />

          <SearchInput
            value={filters.query}
            onValueChange={filters.setQuery}
            placeholder="Search items..."
            aria-label="Search items"
            className="w-40 sm:w-56"
          />

          <FilterDropdown
            label="Category"
            icon={Tags}
            value={filters.categoryId}
            options={categoryOptions}
            onChange={filters.setCategoryId}
            neutralValue={ALL_CATEGORIES}
          />

          <FilterDropdown
            label="Availability"
            icon={SlidersHorizontal}
            value={filters.availability}
            options={AVAILABILITY_OPTIONS}
            onChange={(value) => filters.setAvailability(value as AvailabilityFilter)}
            neutralValue={ALL_AVAILABILITY}
          />

          {filters.isFiltered && (
            <Button variant="ghost" size="sm" onClick={filters.resetFilters}>
              Reset
            </Button>
          )}
        </TableToolbar>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="No items yet"
              description="Add your first item to start tracking inventory."
              action={
                <ButtonLink href="/admin/items/add" icon={Plus} size="sm">
                  Add item
                </ButtonLink>
              }
            />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No items match your filters"
              description="Try a different search term or clear the active filters."
              action={
                <Button variant="secondary" size="sm" onClick={filters.resetFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : viewMode === 'table' ? (
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(item) => String(item.id)}
              onRowClick={(item) => setSelectedId(String(item.id))}
              activeRowKey={selectedId ?? undefined}
              sortBy={sort.sortBy}
              sortDirection={sort.direction}
              onSortChange={sort.toggle}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {rows.map((item) => (
                <ItemCard key={item.id} item={item} onSelect={() => setSelectedId(String(item.id))} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ItemDetailPanel item={selected} onClose={() => setSelectedId(null)} onDeleted={reload} />
      )}
    </div>
  );
}
