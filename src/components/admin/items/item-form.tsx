'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { buildCategoryTree, flattenCategoryTree, toCategoryKey } from '@/lib/category-tree';
import type { Category, Item } from '@/types';
import type { UploadedImage } from '@/hooks/use-image-upload';
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
import { ImageUploader } from './image-uploader';
import { useItemForm } from './use-item-form';
import { EMPTY_ITEM_FORM, toItemPayload } from './item-form-state';

type ItemFormProps = {
  categories: Category[];
  item?: Item;
  initialImages?: UploadedImage[];
};

const optionLabel = (name: string, depth: number) =>
  `${'\u00A0\u00A0'.repeat(depth)}${depth ? '└ ' : ''}${name}`;

export function ItemForm({ categories, item, initialImages = [] }: ItemFormProps) {
  const router = useRouter();
  const toast = useToast();
  const confirmDelete = useConfirmDelete();
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { values, errors, setField, touchAll, isValid } = useItemForm(
    item
      ? {
          name: item.name,
          categoryId: toCategoryKey(item.category_id),
          description: item.description ?? '',
          brand: item.brand ?? '',
          model: item.model ?? '',
          quantity: String(item.quantity),
        }
      : EMPTY_ITEM_FORM,
  );

  const categoryOptions = useMemo(
    () => flattenCategoryTree(buildCategoryTree(categories)),
    [categories],
  );

  /** Images are replaced wholesale: simpler and keeps the order/primary flag in sync */
  async function saveImages(itemId: string) {
    await supabase.from('item_images').delete().eq('item_id', itemId);
    if (images.length === 0) return null;

    const { error } = await supabase.from('item_images').insert(
      images.map((image, index) => ({
        item_id: itemId,
        url: image.url,
        is_primary: index === 0,
        sort_order: index,
      })),
    );
    return error;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    touchAll();
    if (!isValid) return;

    setSaving(true);
    const payload = toItemPayload(values);

    const { data, error } = item
      ? await supabase.from('items').update(payload).eq('id', item.id).select('id').single()
      : await supabase.from('items').insert(payload).select('id').single();

    const imagesError = error || !data ? null : await saveImages(data.id);
    setSaving(false);

    if (error || imagesError) {
      toast.error((error ?? imagesError)?.message ?? 'Could not save the item');
      return;
    }

    toast.success(item ? 'Item updated' : 'Item created');
    router.push(item ? `/admin/items/${item.id}` : '/admin/items');
    router.refresh();
  }

  async function handleDelete() {
    if (!item || !(await confirmDelete('item'))) return;

    setDeleting(true);
    const { error } = await supabase.from('items').delete().eq('id', item.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Item deleted');
    router.push('/admin/items');
    router.refresh();
  }

  return (
    <Card>
      <CardBody className="lg:p-6">
        <form onSubmit={handleSubmit} noValidate>
          <FormSection title="Basics" description="What is this item and where does it belong?">
            <FormField label="Name" required error={errors.name}>
              {(props) => (
                <TextInput
                  {...props}
                  value={values.name}
                  onChange={(event) => setField('name', event.target.value)}
                  placeholder="e.g. Folding chair"
                  autoFocus
                />
              )}
            </FormField>

            <FormField label="Category" required error={errors.categoryId}>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={values.categoryId}
                  onChange={(event) => setField('categoryId', event.target.value)}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {optionLabel(option.name, option.depth)}
                    </option>
                  ))}
                </NativeSelect>
              )}
            </FormField>

            <FormField label="Description" error={errors.description}>
              {(props) => (
                <Textarea
                  {...props}
                  value={values.description}
                  onChange={(event) => setField('description', event.target.value)}
                  rows={4}
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title="Specification" description="Optional manufacturer details and stock.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Brand" error={errors.brand}>
                {(props) => (
                  <TextInput
                    {...props}
                    value={values.brand}
                    onChange={(event) => setField('brand', event.target.value)}
                  />
                )}
              </FormField>

              <FormField label="Model" error={errors.model}>
                {(props) => (
                  <TextInput
                    {...props}
                    value={values.model}
                    onChange={(event) => setField('model', event.target.value)}
                  />
                )}
              </FormField>
            </div>

            <FormField label="Quantity" required error={errors.quantity}>
              {(props) => (
                <TextInput
                  {...props}
                  type="number"
                  min={0}
                  step={1}
                  value={values.quantity}
                  onChange={(event) => setField('quantity', event.target.value)}
                  className="sm:max-w-40"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title="Photos" description="The first image is used as the thumbnail.">
            <ImageUploader images={images} onChange={setImages} onError={toast.error} />
          </FormSection>

          <FormActions>
            {item && (
              <Button
                variant="danger"
                icon="trash"
                onClick={handleDelete}
                loading={deleting}
                className="sm:mr-auto"
              >
                Delete
              </Button>
            )}
            <ButtonLink href={item ? `/admin/items/${item.id}` : '/admin/items'} variant="secondary">
              Cancel
            </ButtonLink>
            <Button type="submit" loading={saving} disabled={!isValid}>
              {item ? 'Save changes' : 'Create item'}
            </Button>
          </FormActions>
        </form>
      </CardBody>
    </Card>
  );
}
