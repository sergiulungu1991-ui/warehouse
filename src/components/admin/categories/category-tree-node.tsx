'use client';

import { ChevronRight, Folder, FolderOpen, Tag } from 'lucide-react';
import type { CategoryTreeNode as TreeNode } from '@/lib/category-tree';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CategoryTreeNodeProps = {
  node: TreeNode;
  depth: number;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  selectedId?: string;
};

export function CategoryTreeNode({
  node,
  depth,
  isExpanded,
  onToggle,
  onSelect,
  selectedId,
}: CategoryTreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && isExpanded(node.id);
  const isSelected = selectedId === node.id;
  const NodeIcon = hasChildren ? (expanded ? FolderOpen : Folder) : Tag;

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(node)}
        onKeyDown={(event) => event.key === 'Enter' && onSelect(node)}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        className={cn(
          'flex h-7 cursor-pointer items-center gap-1.5 border-b border-line pr-2 text-xs transition-colors',
          isSelected ? 'bg-surface-400' : 'hover:bg-surface-300',
        )}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle(node.id);
          }}
          disabled={!hasChildren}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-fg-subtle transition-colors disabled:opacity-0 enabled:hover:bg-surface-400 enabled:hover:text-fg"
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform duration-200', expanded && 'rotate-90')}
          />
        </button>

        <NodeIcon className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />

        <span className="truncate font-medium text-fg">{node.name}</span>

        <span className="ml-auto flex shrink-0 items-center gap-1">
          {hasChildren && <Badge>{node.children.length}</Badge>}
          <Badge
            tone={node.totalItemCount > 0 ? 'success' : 'neutral'}
            title={`${node.directItemCount} direct / ${node.totalItemCount} total`}
          >
            <span className="font-mono">{node.totalItemCount}</span>
          </Badge>
        </span>
      </div>

      {expanded && (
        <ul>
          {node.children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
