import type { Rental } from '@/types';

/** Rental joined with the quantities booked for one specific item */
export type ItemRental = Rental & {
  quantity: number;
  returned_quantity: number;
};

export const ACTIVE_RENTAL_STATUSES = ['Active', 'Overdue'];
export const CLOSED_RENTAL_STATUSES = ['Returned', 'Canceled'];
