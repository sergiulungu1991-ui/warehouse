'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { CategoryTreeNode } from '@/lib/category-tree';
import { Button, ButtonLink } from '@/components/ui/button';
import { DetailPanel, DetailRow, type DetailTab } from '@/components/ui/detail-panel';
import { useConfirmDelete } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '../rentals/rental-utils';

type CategoryDetailPanelProps = {
  node: CategoryTreeNode;
  parentName?: string;
  onClose: () => void;
  onDeleted: () => void;
};

export function CategoryDetailPanel({
  node,
  parentName,
  onClose,
  onDeleted,
}: CategoryDetailPanelProps) {
  const confirmDelete = useConfirmDelete();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const canDelete = node.children.length === 0 && node.directItemCount === 0;

  async function handleDelete() {
    if (!canDelete) {
      toast.error('Move or remove the subcategories and items first');
      return;
    }
    if (!(await confirmDelete(`"${node.name}"`))) return;

    setDeleting(true);
    const { error } = await supabase.from('categories').delete().eq('id', node.id);
    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Category deleted');
    onClose();
    onDeleted();
  }

  const tabs: DetailTab[] = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <div>
          <DetailRow label="Name">{node.name}</DetailRow>
          <DetailRow label="Parent">{parentName ?? 'Root category'}</DetailRow>
          <DetailRow label="Subcategories">
            <span className="font-mono">{node.children.length}</span>
          </DetailRow>
          <DetailRow label="Direct items">
            <span className="font-mono">{node.directItemCount}</span>
          </DetailRow>
          <DetailRow label="Total items">
            <span className="font-mono">{node.totalItemCount}</span>
          </DetailRow>
          <DetailRow label="Created at">{formatDate(node.created_at) ?? '—'}</DetailRow>
          <DetailRow label="Description">
            {node.description ? (
              <span className="whitespace-pre-line">{node.description}</span>
            ) : (
              '—'
            )}
          </DetailRow>
        </div>
      ),
    },
    {
      value: 'children',
      label: 'Subcategories',
      content:
        node.children.length === 0 ? (
          <p className="p-3 text-[11px] text-fg-subtle">No subcategories.</p>
        ) : (
          <div>
            {node.children.map((child) => (
              <DetailRow key={child.id} label={child.name}>
                <span className="font-mono">{child.totalItemCount} items</span>
              </DetailRow>
            ))}
          </div>
        ),
    },
  ];

  return (
    <DetailPanel
      title={node.name}
      subtitle={parentName ? `in ${parentName}` : 'Root category'}
      tabs={tabs}
      onClose={onClose}
      footer={
        <>
          <ButtonLink href={`/admin/categories/${node.id}`} variant="secondary" size="sm">
            Open page
          </ButtonLink>
          <ButtonLink
            href={`/admin/categories/${node.id}/edit`}
            variant="secondary"
            size="sm"
            icon={Pencil}
          >
            Edit
          </ButtonLink>
          <ButtonLink href={`/admin/categories/add?parent=${node.id}`} size="sm" icon={Plus}>
            Subcategory
          </ButtonLink>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            className="ml-auto"
            loading={deleting}
            disabled={!canDelete}
            title={canDelete ? 'Delete category' : 'Category is not empty'}
            onClick={handleDelete}
            aria-label="Delete category"
          />
        </>
      }
    />
  );
}
