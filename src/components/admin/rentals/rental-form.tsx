'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Item, Rental } from '@/types';
import { Card, CardBody } from '@/components/ui/card';
import { Button, ButtonLink } from '@/components/ui/button';
import {
  FormActions,
  FormField,
  FormSection,
  NativeSelect,
  TextInput,
  Textarea,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { RentalItemsPicker } from './rental-items-picker';
import { formatStatusLabel, RENTAL_STATUSES, toDateInputValue } from './rental-utils';
import {
  emptyRentalForm,
  toRentalPayload,
  validateRental,
  type RentalFormField,
  type RentalFormValues,
  type RentalLine,
} from './rental-form-state';

type RentalFormProps = {
  items: Item[];
  rental?: Rental;
  initialLines?: RentalLine[];
};

export function RentalForm({ items, rental, initialLines = [] }: RentalFormProps) {
  const router = useRouter();
  const toast = useToast();
  const confirmDelete = useConfirmDelete();

  const [values, setValues] = useState<RentalFormValues>(
    rental
      ? {
          renterName: rental.renter_name,
          renterPhone: rental.renter_phone ?? '',
          renterEmail: rental.renter_email ?? '',
          rentedAt: toDateInputValue(rental.rented_at),
          expectedReturnAt: toDateInputValue(rental.expected_return_at),
          returnedAt: toDateInputValue(rental.returned_at),
          status: rental.status,
          notes: rental.notes ?? '',
        }
      : emptyRentalForm(),
  );
  const [lines, setLines] = useState<RentalLine[]>(initialLines);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const allErrors = useMemo(() => validateRental(values, lines), [values, lines]);
  const errors = submitted ? allErrors : {};
  const isValid = Object.keys(allErrors).length === 0;

  const setField = (field: RentalFormField, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  async function replaceLines(rentalId: string) {
    await supabase.from('rental_items').delete().eq('rental_id', rentalId);
    const { error } = await supabase.from('rental_items').insert(
      lines.map((line) => ({
        rental_id: rentalId,
        item_id: line.itemId,
        quantity: line.quantity,
        returned_quantity: line.returnedQuantity,
      })),
    );
    return error;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    setSaving(true);
    const payload = toRentalPayload(values);
    const { data, error } = rental
      ? await supabase.from('rentals').update(payload).eq('id', rental.id).select('id').single()
      : await supabase.from('rentals').insert(payload).select('id').single();

    const linesError = error || !data ? null : await replaceLines(data.id);
    setSaving(false);

    if (error || linesError) {
      toast.error((error ?? linesError)?.message ?? 'Could not save the rental');
      return;
    }

    toast.success(rental ? 'Rental updated' : 'Rental created');
    router.push(rental ? `/admin/rentals/${rental.id}` : '/admin/rentals');
    router.refresh();
  }

  async function handleDelete() {
    if (!rental || !(await confirmDelete('rental'))) return;

    setDeleting(true);
    const { error } = await supabase.from('rentals').delete().eq('id', rental.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Rental deleted');
    router.push('/admin/rentals');
    router.refresh();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} noValidate>
          <FormSection title="Renter" description="Who is taking the equipment out.">
            <FormField label="Full name" required error={errors.renterName}>
              {(props) => (
                <TextInput
                  {...props}
                  value={values.renterName}
                  onChange={(event) => setField('renterName', event.target.value)}
                  autoFocus
                />
              )}
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone" error={errors.renterPhone}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="tel"
                    value={values.renterPhone}
                    onChange={(event) => setField('renterPhone', event.target.value)}
                  />
                )}
              </FormField>

              <FormField label="Email" error={errors.renterEmail}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="email"
                    value={values.renterEmail}
                    onChange={(event) => setField('renterEmail', event.target.value)}
                  />
                )}
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Schedule" description="When it leaves and when it is due back.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Rented at" required error={errors.rentedAt}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="date"
                    value={values.rentedAt}
                    onChange={(event) => setField('rentedAt', event.target.value)}
                  />
                )}
              </FormField>

              <FormField label="Expected return" error={errors.expectedReturnAt}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="date"
                    value={values.expectedReturnAt}
                    onChange={(event) => setField('expectedReturnAt', event.target.value)}
                  />
                )}
              </FormField>

              {rental && (
                <FormField label="Returned at" error={errors.returnedAt}>
                  {(props) => (
                    <TextInput
                      {...props}
                      type="date"
                      value={values.returnedAt}
                      onChange={(event) => setField('returnedAt', event.target.value)}
                    />
                  )}
                </FormField>
              )}

              <FormField label="Status">
                {(props) => (
                  <NativeSelect
                    {...props}
                    value={values.status}
                    onChange={(event) => setField('status', event.target.value)}
                  >
                    {RENTAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatStatusLabel(status)}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Items" description="What goes out with this rental.">
            <RentalItemsPicker
              items={items}
              lines={lines}
              onChange={setLines}
              showReturned={Boolean(rental)}
              error={errors.lines}
            />
          </FormSection>

          <FormSection title="Notes" description="Anything worth remembering about this rental.">
            <FormField label="Notes">
              {(props) => (
                <Textarea
                  {...props}
                  value={values.notes}
                  onChange={(event) => setField('notes', event.target.value)}
                  rows={4}
                />
              )}
            </FormField>
          </FormSection>

          <FormActions>
            {rental && (
              <Button
                variant="danger"
                icon={Trash2}
                onClick={handleDelete}
                loading={deleting}
                className="sm:mr-auto"
              >
                Delete
              </Button>
            )}
            <ButtonLink
              href={rental ? `/admin/rentals/${rental.id}` : '/admin/rentals'}
              variant="secondary"
            >
              Cancel
            </ButtonLink>
            <Button type="submit" loading={saving}>
              {rental ? 'Save changes' : 'Create rental'}
            </Button>
          </FormActions>
        </form>
      </CardBody>
    </Card>
  );
}
