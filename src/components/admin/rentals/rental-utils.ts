import type { BadgeTone } from '@/components/ui/badge';
import type { Rental } from '@/types';

export const RENTAL_STATUSES = ['Active', 'Overdue', 'Canceled', 'Returned'] as const;
export type RentalStatus = (typeof RENTAL_STATUSES)[number];

const LEGACY_STATUS_MAP: Record<string, RentalStatus> = {
  active: 'Active',
  overdue: 'Overdue',
  cancelled: 'Canceled',
  canceled: 'Canceled',
  returned: 'Returned',
};

export const normalizeRentalStatus = (status: string): RentalStatus =>
  LEGACY_STATUS_MAP[status.toLowerCase()] ?? (status as RentalStatus);

const STATUS_TONES: Record<string, BadgeTone> = {
  Active: 'success',
  Returned: 'info',
  Overdue: 'danger',
  Canceled: 'warning',
};

export const rentalStatusTone = (status: string): BadgeTone => STATUS_TONES[status] ?? 'warning';

export const formatStatusLabel = (status: string) => status;

/**
 * Fixed locale + UTC keep server and client output identical,
 * otherwise the SSR markup and the hydrated markup would differ.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (value: string | null | undefined): string | null =>
  value ? DATE_FORMATTER.format(new Date(value)) : null;

/** Date-only value accepted by <input type="date"> */
export const toDateInputValue = (value: string | null | undefined): string =>
  value ? value.split('T')[0] : '';

const startOfToday = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

type OverdueSource = Pick<Rental, 'expected_return_at' | 'returned_at' | 'status'>;

/** A rental is late when its due date passed while it is still not returned */
export const isRentalOverdue = ({ expected_return_at, returned_at, status }: OverdueSource) => {
  if (returned_at || status === 'Returned' || status === 'Canceled') return false;
  if (!expected_return_at) return false;
  return new Date(expected_return_at).getTime() < startOfToday();
};
