import { createClient } from '@/lib/supabase/server';

const ACTIVE_RENTAL_STATUSES = ['Active', 'Overdue'] as const;

type RentalItemWithStatus = {
  item_id: string;
  quantity: number;
  returned_quantity: number;
  rentals: { status: 'Active' | 'Overdue' | 'Canceled' | 'Returned' } | { status: 'Active' | 'Overdue' | 'Canceled' | 'Returned' }[];
};

function getRentalStatus(rental: { status: 'Active' | 'Overdue' | 'Canceled' | 'Returned' } | { status: 'Active' | 'Overdue' | 'Canceled' | 'Returned' }[]) {
  return Array.isArray(rental) ? rental[0]?.status : rental.status;
}

export async function getAvailableByItemIds(ids: string[]): Promise<Record<string, number>> {
  const supabase = await createClient();
  if (ids.length === 0) return {};

  const { data, error } = await supabase
    .from('rental_items')
    .select('item_id, quantity, returned_quantity, rentals!inner(status)')
    .in('item_id', ids)
    .neq('rentals.status', 'Returned')
    .neq('rentals.status', 'Canceled');

  if (error) throw new Error(error.message);

  const rented = new Map<string, number>();
  for (const row of (data ?? []) as unknown as RentalItemWithStatus[]) {
    const status = getRentalStatus(row.rentals);
    if (!ACTIVE_RENTAL_STATUSES.includes(status as 'Active' | 'Overdue')) continue;
    const amount = Math.max(row.quantity - (row.returned_quantity ?? 0), 0);
    const itemId = String(row.item_id);
    rented.set(itemId, (rented.get(itemId) ?? 0) + amount);
  }

  return Object.fromEntries(ids.map((id) => [String(id), rented.get(String(id)) ?? 0]));
}

export function calculateAvailable(total: number, rented: number): number {
  return Math.max(total - rented, 0);
}
