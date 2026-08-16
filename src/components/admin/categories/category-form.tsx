'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  buildCategoryTree,
  collectCategoryBranchIds,
  flattenCategoryTree,
  toCategoryKey,
} from '@/lib/category-tree';
import type { Category } from '@/types';
import { Card, CardBody } from '@/components/ui/card';
import { Button, ButtonLink } from '@/components/ui/button';
import { FormActions, FormField, FormSection, NativeSelect, TextInput, Textarea } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useCategoryForm } from './use-category-form';
import {
  DESCRIPTION_MAX_LENGTH,
  EMPTY_CATEGORY_FORM,
  NAME_MAX_LENGTH,
  parentOptionLabel,
  toCategoryPayload,
} from './category-form-state';

type CategoryFormProps = {
  categories: Category[];
  category?: Category;
};

export function CategoryForm({ categories, category }: CategoryFormProps) {
  const router = useRouter();
  const toast = useToast();
  const confirmDelete = useConfirmDelete();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { values, errors, setField, touchAll, isValid } = useCategoryForm(
    category
      ? {
          name: category.name,
          description: category.description ?? '',
          parentId: category.parent_id ? toCategoryKey(category.parent_id) : '',
        }
      : EMPTY_CATEGORY_FORM,
  );

  // A category can never be its own ancestor, so hide itself and its descendants
  const parentOptions = useMemo(() => {
    const tree = buildCategoryTree(categories);
    const excluded = category ? new Set(collectCategoryBranchIds(tree, toCategoryKey(category.id))) : null;
    return flattenCategoryTree(tree).filter((option) => !excluded?.has(option.id));
  }, [categories, category]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    touchAll();
    if (!isValid) return;

    setSaving(true);
    const payload = toCategoryPayload(values);
    const { error } = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(category ? 'Category updated' : 'Category created');
    router.push('/admin/categories');
    router.refresh();
  }

  async function handleDelete() {
    if (!category || !(await confirmDelete('category'))) return;

    setDeleting(true);
    const { error } = await supabase.from('categories').delete().eq('id', category.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Category deleted');
    router.push('/admin/categories');
    router.refresh();
  }

  return (
    <Card>
      <CardBody className="lg:p-6">
        <form onSubmit={handleSubmit} noValidate>
          <FormSection title="Details" description="Name and short description of the category.">
            <FormField label="Name" required error={errors.name}>
              {(props) => (
                <TextInput
                  {...props}
                  value={values.name}
                  onChange={(event) => setField('name', event.target.value)}
                  maxLength={NAME_MAX_LENGTH}
                  placeholder="e.g. Furniture"
                  autoFocus
                />
              )}
            </FormField>

            <FormField
              label="Description"
              error={errors.description}
              hint={`${values.description.length}/${DESCRIPTION_MAX_LENGTH} characters`}
            >
              {(props) => (
                <Textarea
                  {...props}
                  value={values.description}
                  onChange={(event) => setField('description', event.target.value)}
                  rows={4}
                  placeholder="What belongs in this category?"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection
            title="Hierarchy"
            description="Leave empty to create a root category."
          >
            <FormField label="Parent category">
              {(props) => (
                <NativeSelect
                  {...props}
                  value={values.parentId}
                  onChange={(event) => setField('parentId', event.target.value)}
                >
                  <option value="">No parent (root)</option>
                  {parentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {parentOptionLabel(option)}
                    </option>
                  ))}
                </NativeSelect>
              )}
            </FormField>
          </FormSection>

          <FormActions>
            {category && (
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
            <ButtonLink href="/admin/categories" variant="secondary">
              Cancel
            </ButtonLink>
            <Button type="submit" loading={saving} disabled={!isValid}>
              {category ? 'Save changes' : 'Create category'}
            </Button>
          </FormActions>
        </form>
      </CardBody>
    </Card>
  );
}
