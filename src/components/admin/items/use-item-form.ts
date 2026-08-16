'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  validateItem,
  type ItemFormErrors,
  type ItemFormField,
  type ItemFormValues,
} from './item-form-state';

const ALL_FIELDS: ItemFormField[] = [
  'name',
  'categoryId',
  'description',
  'brand',
  'model',
  'quantity',
];

/**
 * Validation runs on every keystroke but a message only shows once the field
 * was touched (or submit was attempted), so a pristine form stays quiet.
 */
export function useItemForm(initialValues: ItemFormValues) {
  const [values, setValues] = useState<ItemFormValues>(initialValues);
  const [touched, setTouched] = useState<ItemFormField[]>([]);

  const allErrors = useMemo(() => validateItem(values), [values]);

  const errors = useMemo<ItemFormErrors>(
    () =>
      touched.reduce<ItemFormErrors>((acc, field) => {
        if (allErrors[field]) acc[field] = allErrors[field];
        return acc;
      }, {}),
    [allErrors, touched],
  );

  const setField = useCallback((field: ItemFormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => (prev.includes(field) ? prev : [...prev, field]));
  }, []);

  return {
    values,
    errors,
    setField,
    touchAll: useCallback(() => setTouched(ALL_FIELDS), []),
    isValid: Object.keys(allErrors).length === 0,
  };
}
