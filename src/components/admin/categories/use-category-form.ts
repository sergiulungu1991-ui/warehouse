'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  validateCategory,
  type CategoryFormErrors,
  type CategoryFormField,
  type CategoryFormValues,
} from './category-form-state';

const ALL_FIELDS: CategoryFormField[] = ['name', 'description', 'parentId'];

/**
 * Validation runs on every keystroke but a message only appears once the user
 * touched the field (or tried to submit), so a pristine form is never noisy.
 */
export function useCategoryForm(initialValues: CategoryFormValues) {
  const [values, setValues] = useState<CategoryFormValues>(initialValues);
  const [touched, setTouched] = useState<CategoryFormField[]>([]);

  const allErrors = useMemo(() => validateCategory(values), [values]);

  const errors = useMemo<CategoryFormErrors>(
    () =>
      touched.reduce<CategoryFormErrors>((acc, field) => {
        if (allErrors[field]) acc[field] = allErrors[field];
        return acc;
      }, {}),
    [allErrors, touched],
  );

  const setField = useCallback((field: CategoryFormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => (prev.includes(field) ? prev : [...prev, field]));
  }, []);

  const touchAll = useCallback(() => setTouched(ALL_FIELDS), []);

  return {
    values,
    errors,
    setField,
    touchAll,
    isValid: Object.keys(allErrors).length === 0,
  };
}
