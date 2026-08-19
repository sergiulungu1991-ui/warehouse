'use client';

import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RowAction = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onSelect?: () => void;
  tone?: 'default' | 'danger';
  /** Insert a divider above this entry */
  separated?: boolean;
};

const ITEM_CLASS =
  'flex h-7 cursor-pointer items-center gap-2 rounded px-2 text-xs outline-none data-[highlighted]:bg-surface-400';

/** Three-dot menu holding per-row actions, keeps table rows uncluttered */
export function RowActionsMenu({ actions }: { actions: RowAction[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Row actions"
        onClick={(event) => event.stopPropagation()}
        className="flex h-6 w-6 items-center justify-center rounded text-fg-subtle transition-colors hover:bg-surface-400 hover:text-fg data-[state=open]:bg-surface-400"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          onClick={(event) => event.stopPropagation()}
          className="z-50 min-w-36 rounded-md border border-line bg-surface-300 p-1 shadow-lg shadow-black/30"
        >
          {actions.map((action) => {
            const { label, icon: Icon, href, onSelect, tone, separated } = action;
            const toneClass =
              tone === 'danger' ? 'text-red-400 data-[highlighted]:text-red-300' : 'text-fg-muted data-[highlighted]:text-fg';

            return (
              <div key={label}>
                {separated && <DropdownMenu.Separator className="my-1 h-px bg-line" />}
                <DropdownMenu.Item
                  onSelect={onSelect}
                  asChild={Boolean(href)}
                  className={cn(ITEM_CLASS, toneClass)}
                >
                  {href ? (
                    <Link href={href}>
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {label}
                    </Link>
                  ) : (
                    <>
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {label}
                    </>
                  )}
                </DropdownMenu.Item>
              </div>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
