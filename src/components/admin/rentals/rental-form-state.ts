import type { RentalInsert } from '@/types';
import { normalizeRentalStatus } from './rental-utils';

export type RentalLine = {
  itemId: string;
  quantity: number;
  returnedQuantity: number;
};

export type RentalFormValues = {
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  rentedAt: string;
  expectedReturnAt: string;
  returnedAt: string;
  status: string;
  notes: string;
};

export type RentalFormField = keyof RentalFormValues;
export type RentalFormErrors = Partial<Record<RentalFormField | 'lines', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const todayInputValue = () => new Date().toISOString().split('T')[0];

export const emptyRentalForm = (): RentalFormValues => ({
  renterName: '',
  renterPhone: '',
  renterEmail: '',
  rentedAt: todayInputValue(),
  expectedReturnAt: '',
  returnedAt: '',
  status: 'Active',
  notes: '',
});

export function validateRental(values: RentalFormValues, lines: RentalLine[]): RentalFormErrors {
  const errors: RentalFormErrors = {};

  if (!values.renterName.trim()) errors.renterName = 'Renter name is required.';
  if (!values.rentedAt) errors.rentedAt = 'Rental date is required.';

  if (values.renterEmail.trim() && !EMAIL_PATTERN.test(values.renterEmail.trim()))
    errors.renterEmail = 'Enter a valid email address.';

  if (values.expectedReturnAt && values.rentedAt && values.expectedReturnAt < values.rentedAt)
    errors.expectedReturnAt = 'Return date cannot be before the rental date.';

  if (values.returnedAt && values.rentedAt && values.returnedAt < values.rentedAt)
    errors.returnedAt = 'Return date cannot be before the rental date.';

  if (lines.length === 0) errors.lines = 'Add at least one item to the rental.';
  else if (lines.some((line) => line.quantity < 1))
    errors.lines = 'Every position needs a quantity of at least 1.';
  else if (lines.some((line) => line.returnedQuantity > line.quantity))
    errors.lines = 'Returned quantity cannot exceed the rented quantity.';

  return errors;
}

/** Maps the form state to the shape expected by the `rentals` table */
export const toRentalPayload = (values: RentalFormValues): RentalInsert => ({
  renter_name: values.renterName.trim(),
  renter_phone: values.renterPhone.trim() || null,
  renter_email: values.renterEmail.trim() || null,
  rented_at: values.rentedAt,
  expected_return_at: values.expectedReturnAt || null,
  returned_at: values.returnedAt || null,
  status: normalizeRentalStatus(values.status),
  notes: values.notes.trim() || null,
});
