'use client';

import Link from 'next/link';
import type { CategoryTreeNode as TreeNode } from '@/lib/category-tree';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

const DEPTH_ACCENTS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
] as const;

type CategoryTreeNodeProps = {
  node: TreeNode;
  depth: number;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
};

export function CategoryTreeNode({ node, depth, isExpanded, onToggle }: CategoryTreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && isExpanded(node.id);

  return (
    <li className="relative">
      {/* Horizontal connector joining the child to its parent guide line */}
      {depth > 0 && (
        <span className="absolute -left-4 top-5 h-px w-4 bg-zinc-200 dark:bg-zinc-700" />
      )}

      <div className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          disabled={!hasChildren}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors disabled:opacity-0 enabled:hover:bg-zinc-200 dark:text-zinc-400 dark:enabled:hover:bg-zinc-700"
        >
          <Icon
            name="chevronRight"
            className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
          />
        </button>

        <span
          className={`h-2 w-2 shrink-0 rounded-full ${DEPTH_ACCENTS[depth % DEPTH_ACCENTS.length]}`}
        />

        <Link
          href={`/admin/categories/${node.id}`}
          className="truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
        >
          {node.name}
        </Link>

        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          {hasChildren && <Badge>{node.children.length} sub</Badge>}
          <Badge tone="info" title={`${node.directItemCount} direct / ${node.totalItemCount} total`}>
            {node.totalItemCount} items
          </Badge>
        </span>
      </div>

      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="ml-3 space-y-0.5 border-l border-zinc-200 pl-4 dark:border-zinc-700">
              {node.children.map((child) => (
                <CategoryTreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isExpanded={isExpanded}
                  onToggle={onToggle}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
