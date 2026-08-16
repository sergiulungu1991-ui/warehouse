import type { Category } from '@/types';

export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
  /** Items linked directly to this category */
  directItemCount: number;
  /** Items of this category plus every descendant */
  totalItemCount: number;
};

/**
 * Builds a nested tree out of the flat `categories` rows.
 * Rows whose `parent_id` points to a missing category are treated as roots,
 * so a broken reference never hides data from the dashboard.
 */
/**
 * Postgres serial ids arrive as numbers while DOM values (select, params) are
 * always strings, so every id comparison goes through this normalizer.
 */
export const toCategoryKey = (id: string | number | null | undefined): string => String(id ?? '');

export function buildCategoryTree(
  categories: Category[],
  itemCountByCategory: Record<string, number> = {},
): CategoryTreeNode[] {
  const nodeById = new Map<string, CategoryTreeNode>(
    categories.map((category) => [
      toCategoryKey(category.id),
      {
        ...category,
        children: [],
        directItemCount: itemCountByCategory[toCategoryKey(category.id)] ?? 0,
        totalItemCount: 0,
      },
    ]),
  );

  const roots: CategoryTreeNode[] = [];
  for (const node of nodeById.values()) {
    const parent = node.parent_id ? nodeById.get(toCategoryKey(node.parent_id)) : undefined;
    if (parent && toCategoryKey(parent.id) !== toCategoryKey(node.id)) parent.children.push(node);
    else roots.push(node);
  }

  const sortAndCount = (nodes: CategoryTreeNode[]): number => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    return nodes.reduce((sum, node) => {
      node.totalItemCount = node.directItemCount + sortAndCount(node.children);
      return sum + node.totalItemCount;
    }, 0);
  };
  sortAndCount(roots);

  return roots;
}

/** Keeps nodes matching `query` together with their ancestors */
export function filterCategoryTree(nodes: CategoryTreeNode[], query: string): CategoryTreeNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return nodes;

  return nodes.reduce<CategoryTreeNode[]>((acc, node) => {
    const children = filterCategoryTree(node.children, normalized);
    if (children.length || node.name.toLowerCase().includes(normalized)) {
      acc.push({ ...node, children });
    }
    return acc;
  }, []);
}

export type FlatCategoryOption = { id: string; name: string; depth: number };

/** Depth-first list used to render the hierarchy inside a native <select> */
export function flattenCategoryTree(nodes: CategoryTreeNode[], depth = 0): FlatCategoryOption[] {
  return nodes.flatMap((node) => [
    { id: toCategoryKey(node.id), name: node.name, depth },
    ...flattenCategoryTree(node.children, depth + 1),
  ]);
}

/** Returns `categoryId` together with every descendant id, so filters include subcategories */
export function collectCategoryBranchIds(
  nodes: CategoryTreeNode[],
  categoryId: string,
): string[] {
  for (const node of nodes) {
    if (toCategoryKey(node.id) === toCategoryKey(categoryId)) {
      return [
        toCategoryKey(node.id),
        ...flattenCategoryTree(node.children).map((child) => child.id),
      ];
    }
    const found = collectCategoryBranchIds(node.children, categoryId);
    if (found.length) return found;
  }
  return [];
}

export function countCategoryTree(nodes: CategoryTreeNode[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countCategoryTree(node.children), 0);
}
