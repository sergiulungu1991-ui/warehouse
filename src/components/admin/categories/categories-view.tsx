'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsDownUp, ChevronsUpDown, Plus, Search, Tags } from 'lucide-react';
import {
  countCategoryTree,
  filterCategoryTree,
  type CategoryTreeNode as TreeNode,
} from '@/lib/category-tree';
import { Button, ButtonLink } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/form-controls';
import { TableToolbar } from '@/components/ui/table-toolbar';
import { EmptyState } from '@/components/ui/empty-state';
import { CategoryTreeNode } from './category-tree-node';
import { CategoryDetailPanel } from './category-detail-panel';

const collectIds = (nodes: TreeNode[]): string[] =>
  nodes.flatMap((node) => [node.id, ...collectIds(node.children)]);

/** Flat index so the detail panel can resolve a node and its parent name */
function indexTree(nodes: TreeNode[], parentName?: string) {
  const map = new Map<string, { node: TreeNode; parentName?: string }>();
  const walk = (list: TreeNode[], parent?: string) => {
    for (const node of list) {
      map.set(node.id, { node, parentName: parent });
      walk(node.children, node.name);
    }
  };
  walk(nodes, parentName);
  return map;
}

export function CategoriesView({ nodes }: { nodes: TreeNode[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleNodes = useMemo(() => filterCategoryTree(nodes, query), [nodes, query]);
  const index = useMemo(() => indexTree(nodes), [nodes]);
  const isSearching = query.trim().length > 0;
  const selected = selectedId ? index.get(selectedId) : undefined;

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
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <TableToolbar
          resultCount={countCategoryTree(visibleNodes)}
          totalCount={countCategoryTree(nodes)}
          action={
            <ButtonLink href="/admin/categories/add" icon={Plus} size="sm">
              Add category
            </ButtonLink>
          }
        >
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="w-40 sm:w-56"
          />

          <Button
            variant="secondary"
            size="sm"
            icon={ChevronsUpDown}
            onClick={() => setCollapsedIds(new Set())}
          >
            Expand
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronsDownUp}
            onClick={() => setCollapsedIds(new Set(collectIds(nodes)))}
          >
            Collapse
          </Button>

          {isSearching && (
            <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
              Reset
            </Button>
          )}
        </TableToolbar>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {visibleNodes.length === 0 ? (
            <EmptyState
              icon={isSearching ? Search : Tags}
              title={isSearching ? 'No categories match your search' : 'No categories yet'}
              description={
                isSearching
                  ? `Nothing matches "${query}". Try another name.`
                  : 'Categories organise your inventory in a parent to child hierarchy.'
              }
              action={
                isSearching ? (
                  <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
                    Reset filters
                  </Button>
                ) : (
                  <ButtonLink href="/admin/categories/add" icon={Plus} size="sm">
                    Add category
                  </ButtonLink>
                )
              }
            />
          ) : (
            <ul>
              {visibleNodes.map((node) => (
                <CategoryTreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  isExpanded={isExpanded}
                  onToggle={toggle}
                  onSelect={(selectedNode) => setSelectedId(selectedNode.id)}
                  selectedId={selectedId ?? undefined}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {selected && (
        <CategoryDetailPanel
          node={selected.node}
          parentName={selected.parentName}
          onClose={() => setSelectedId(null)}
          onDeleted={() => router.refresh()}
        />
      )}
    </div>
  );
}
