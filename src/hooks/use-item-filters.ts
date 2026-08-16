'use client';

import { useMemo, useState } from 'react';
import {
  buildCategoryTree,
  collectCategoryBranchIds,
  flattenCategoryTree,
  toCategoryKey,
  type FlatCategoryOption,
} from '@/lib/category-tree';
import type { Category } from '@/types';
import type { ItemWithRelations } from '@/lib/items-data';

export const ALL_CATEGORIES = 'all';
export const ALL_AVAILABILITY = 'all';
export const RENTED_AVAILABILITY = 'rented';
export const AVAILABLE_AVAILABILITY = 'available';

export type AvailabilityFilter = 'all' | 'rented' | 'available';

type UseItemFiltersResult = {
  query: string;
  setQuery: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  availability: AvailabilityFilter;
  setAvailability: (value: AvailabilityFilter) => void;
  categoryOptions: FlatCategoryOption[];
  filteredItems: ItemWithRelations[];
  isFiltered: boolean;
  resetFilters: () => void;
};

const matchesQuery = (item: ItemWithRelations, query: string) =>
  [item.name, item.brand, item.model, item.description, item.categories?.name].some((field) =>
    field?.toLowerCase().includes(query),
  );

const matchesAvailability = (item: ItemWithRelations, availability: AvailabilityFilter) => {
  if (availability === ALL_AVAILABILITY) return true;
  const rented = (item.quantity ?? 0) - item.available;
  if (availability === RENTED_AVAILABILITY) return rented > 0;
  return item.available > 0;
};

export function useItemFilters(
  items: ItemWithRelations[],
  categories: Category[],
): UseItemFiltersResult {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES);
  const [availability, setAvailability] = useState<AvailabilityFilter>(ALL_AVAILABILITY);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const categoryOptions = useMemo(() => flattenCategoryTree(tree), [tree]);

  // A parent selection also matches every descendant category
  const allowedCategoryIds = useMemo(
    () =>
      categoryId === ALL_CATEGORIES ? null : new Set(collectCategoryBranchIds(tree, categoryId)),
    [tree, categoryId],
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (!allowedCategoryIds || allowedCategoryIds.has(toCategoryKey(item.category_id))) &&
        (!normalized || matchesQuery(item, normalized)) &&
        matchesAvailability(item, availability),
    );
  }, [items, query, allowedCategoryIds, availability]);

  const resetFilters = () => {
    setQuery('');
    setCategoryId(ALL_CATEGORIES);
    setAvailability(ALL_AVAILABILITY);
  };

  return {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    availability,
    setAvailability,
    categoryOptions,
    filteredItems,
    isFiltered: query.trim().length > 0 || categoryId !== ALL_CATEGORIES || availability !== ALL_AVAILABILITY,
    resetFilters,
  };
}
