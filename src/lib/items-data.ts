import { createClient } from '@/lib/supabase/server';
import type { Category, Item } from '@/types';

export type ItemWithRelations = Item & {
  categories: { name: string } | null;
  images: { url: string }[];
  available: number;
};

export type ItemsSnapshot = {
  items: ItemWithRelations[];
  categories: Category[];
  error: string;
};

type RentalStatus = 'Active' | 'Overdue' | 'Canceled' | 'Returned';
type EmbeddedRental = { status: RentalStatus } | { status: RentalStatus }[];

type ActiveRentalItem = {
  item_id: string;
  quantity: number;
  returned_quantity: number;
  rentals: EmbeddedRental;
};

const readStatus = (rental: EmbeddedRental) =>
  Array.isArray(rental) ? rental[0]?.status : rental.status;

/** Units still out of the warehouse, keyed by item id */
function calcRentedByItem(rentalItems: ActiveRentalItem[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rentalItems) {
    const status = readStatus(row.rentals);
    if (status !== 'Active' && status !== 'Overdue') continue;
    const rented = Math.max(row.quantity - (row.returned_quantity ?? 0), 0);
    const itemId = String(row.item_id);
    map.set(itemId, (map.get(itemId) ?? 0) + rented);
  }
  return map;
}

/**
 * Items, their category, images and live availability in three parallel queries.
 * Images are embedded instead of queried per item (previously an N+1).
 */
export async function fetchItemsSnapshot(): Promise<ItemsSnapshot> {
  const supabase = await createClient();
  const [itemsResult, categoriesResult, rentalItemsResult] = await Promise.all([
    supabase
      .from('items')
      .select('*, categories(name), item_images(url, is_primary, sort_order)')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('*'),
    supabase
      .from('rental_items')
      .select('item_id, quantity, returned_quantity, rentals!inner(status)')
      .neq('rentals.status', 'Returned')
      .neq('rentals.status', 'Canceled'),
  ]);

  const failure = itemsResult.error ?? categoriesResult.error ?? rentalItemsResult.error;
  if (failure) return { items: [], categories: [], error: failure.message };

  const rentedByItem = calcRentedByItem((rentalItemsResult.data ?? []) as ActiveRentalItem[]);

  return {
    items: (itemsResult.data ?? []).map(({ item_images, ...item }) => ({
      ...item,
      images: [...item_images]
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
        .map(({ url }) => ({ url })),
      available: Math.max((item.quantity ?? 0) - (rentedByItem.get(String(item.id)) ?? 0), 0),
    })),
    categories: categoriesResult.data ?? [],
    error: '',
  };
}
