import type { FlatCategoryOption } from '@/lib/category-tree';

export type CategoryFormValues = {
  name: string;
  description: string;
  parentId: string;
};

export type CategoryFormField = keyof CategoryFormValues;
export type CategoryFormErrors = Partial<Record<CategoryFormField, string>>;

export const EMPTY_CATEGORY_FORM: CategoryFormValues = { name: '', description: '', parentId: '' };

export const NAME_MAX_LENGTH = 80;
export const DESCRIPTION_MAX_LENGTH = 500;

export function validateCategory(values: CategoryFormValues): CategoryFormErrors {
  const errors: CategoryFormErrors = {};
  const name = values.name.trim();

  if (!name) errors.name = 'Name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > NAME_MAX_LENGTH)
    errors.name = `Name must be at most ${NAME_MAX_LENGTH} characters.`;

  if (values.description.trim().length > DESCRIPTION_MAX_LENGTH)
    errors.description = `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`;

  return errors;
}

/** Maps the form state to the shape expected by the `categories` table */
export const toCategoryPayload = (values: CategoryFormValues) => ({
  name: values.name.trim(),
  description: values.description.trim() || null,
  parent_id: values.parentId || null,
});

/** Renders the hierarchy inside a native <select>, matching the items filters */
export const parentOptionLabel = ({ name, depth }: FlatCategoryOption) =>
  `${'\u00A0\u00A0'.repeat(depth)}${depth ? '└ ' : ''}${name}`;
