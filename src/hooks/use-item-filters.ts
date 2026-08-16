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

/** All names from the item's category up to the root, including every ancestor */
function getCategoryAncestorNames(item: ItemWithRelations, categoryById: Map<string, Category>): string[] {
  const names: string[] = [];
  let current = categoryById.get(toCategoryKey(item.category_id));
  while (current) {
    names.push(current.name);
    current = current.parent_id ? categoryById.get(String(current.parent_id)) : undefined;
  }
  return names;
}

const matchesQuery = (item: ItemWithRelations, query: string, categoryById: Map<string, Category>) =>
  [
    item.name,
    item.brand,
    item.model,
    item.description,
    item.categories?.name,
    ...getCategoryAncestorNames(item, categoryById),
  ].some((field) => field?.toLowerCase().includes(query));

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

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [String(c.id), c])),
    [categories],
  );

  // A parent selection also matches every descendant category
  const allowedCategoryIds = useMemo(
    () =>
      categoryId === ALL_CATEGORIES ? null : new Set(collectCategoryBranchIds(tree, categoryId)),
    [tree, categoryId],
  );

  // If the user types a category name, include that category and every descendant
  const queryCategoryIds = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;
    const ids = new Set<string>();
    for (const category of categories) {
      if (category.name.toLowerCase().includes(normalized)) {
        collectCategoryBranchIds(tree, toCategoryKey(category.id)).forEach((id) => ids.add(id));
      }
    }
    return ids;
  }, [categories, tree, query]);

  // Name-based fallback in case the numeric/string category_id lookup is inconsistent
  const queryCategoryNames = useMemo(() => {
    if (!queryCategoryIds) return null;
    const names = new Set<string>();
    for (const id of queryCategoryIds) {
      const category = categoryById.get(id);
      if (category) names.add(category.name);
    }
    return names;
  }, [queryCategoryIds, categoryById]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (!allowedCategoryIds || allowedCategoryIds.has(toCategoryKey(item.category_id))) &&
        (!normalized ||
          matchesQuery(item, normalized, categoryById) ||
          (queryCategoryIds &&
            item.category_id &&
            queryCategoryIds.has(toCategoryKey(item.category_id))) ||
          (queryCategoryNames &&
            item.categories?.name &&
            queryCategoryNames.has(item.categories.name))) &&
        matchesAvailability(item, availability),
    );
  }, [items, query, allowedCategoryIds, availability, categoryById, queryCategoryIds, queryCategoryNames]);

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
