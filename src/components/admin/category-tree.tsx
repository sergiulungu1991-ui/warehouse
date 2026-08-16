'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  countCategoryTree,
  filterCategoryTree,
  type CategoryTreeNode as TreeNode,
} from '@/lib/category-tree';
import { Card } from '@/components/ui/card';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CategoryTreeToolbar } from './category-tree-toolbar';
import { CategoryTreeNode } from './category-tree-node';

type CategoryTreeProps = {
  nodes: TreeNode[];
};

const collectIds = (nodes: TreeNode[]): string[] =>
  nodes.flatMap((node) => [node.id, ...collectIds(node.children)]);

export function CategoryTree({ nodes }: CategoryTreeProps) {
  const [query, setQuery] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const visibleNodes = useMemo(() => filterCategoryTree(nodes, query), [nodes, query]);
  const isSearching = query.trim().length > 0;

  // While searching every branch stays open so matches are never hidden
  const isExpanded = useCallback(
    (id: string) => isSearching || !collapsedIds.has(id),
    [collapsedIds, isSearching],
  );

  const toggle = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <CategoryTreeToolbar
        query={query}
        onQueryChange={setQuery}
        onExpandAll={() => setCollapsedIds(new Set())}
        onCollapseAll={() => setCollapsedIds(new Set(collectIds(nodes)))}
        resultCount={countCategoryTree(visibleNodes)}
        totalCount={countCategoryTree(nodes)}
        trailing={
          <ButtonLink href="/admin/categories/add" icon="plus" size="sm">
            Add Category
          </ButtonLink>
        }
      />

      <Card>
        {visibleNodes.length > 0 ? (
          <ul className="space-y-0.5 p-3">
            {visibleNodes.map((node) => (
              <CategoryTreeNode
                key={node.id}
                node={node}
                depth={0}
                isExpanded={isExpanded}
                onToggle={toggle}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={isSearching ? 'search' : 'tag'}
            title={isSearching ? 'No categories match your search' : 'No categories yet'}
            description={
              isSearching
                ? `Nothing matches "${query}". Try another name.`
                : 'Categories keep your inventory organised in a parent → child hierarchy.'
            }
            action={
              isSearching ? (
                <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
                  Reset filters
                </Button>
              ) : (
                <ButtonLink href="/admin/categories/add" icon="plus" size="sm">
                  Add first category
                </ButtonLink>
              )
            }
          />
        )}
      </Card>
    </>
  );
}
