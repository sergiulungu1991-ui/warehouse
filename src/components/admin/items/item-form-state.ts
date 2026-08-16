export type ItemFormValues = {
  name: string;
  categoryId: string;
  description: string;
  brand: string;
  model: string;
  quantity: string;
};

export type ItemFormField = keyof ItemFormValues;
export type ItemFormErrors = Partial<Record<ItemFormField, string>>;

export const EMPTY_ITEM_FORM: ItemFormValues = {
  name: '',
  categoryId: '',
  description: '',
  brand: '',
  model: '',
  quantity: '1',
};

export function validateItem(values: ItemFormValues): ItemFormErrors {
  const errors: ItemFormErrors = {};

  if (!values.name.trim()) errors.name = 'Name is required.';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!values.categoryId) errors.categoryId = 'Pick a category.';

  const quantity = Number(values.quantity);
  if (values.quantity === '' || Number.isNaN(quantity)) errors.quantity = 'Quantity is required.';
  else if (!Number.isInteger(quantity)) errors.quantity = 'Quantity must be a whole number.';
  else if (quantity < 0) errors.quantity = 'Quantity cannot be negative.';

  return errors;
}

/** Maps the form state to the shape expected by the `items` table */
export const toItemPayload = (values: ItemFormValues) => ({
  name: values.name.trim(),
  category_id: values.categoryId,
  description: values.description.trim() || null,
  brand: values.brand.trim() || null,
  model: values.model.trim() || null,
  quantity: Number(values.quantity),
});
