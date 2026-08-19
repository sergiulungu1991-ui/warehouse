'use client';

import type { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DetailTab = {
  value: string;
  label: string;
  content: ReactNode;
};

type DetailPanelProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  tabs: DetailTab[];
  onClose: () => void;
  /** Rendered in the sticky footer, e.g. Edit / Delete */
  footer?: ReactNode;
};

/**
 * Right-hand inspector. On desktop it takes layout space next to the table,
 * on smaller screens it becomes a full-height overlay.
 */
export function DetailPanel({ title, subtitle, tabs, onClose, footer }: DetailPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/50 xl:hidden" onClick={onClose} />

      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-line bg-surface-200 xl:static xl:z-auto xl:w-[420px] xl:max-w-none xl:shrink-0">
        <Tabs.Root defaultValue={tabs[0]?.value} className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-fg">{title}</p>
              {subtitle && <p className="truncate text-[11px] text-fg-muted">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-fg-subtle transition-colors hover:bg-surface-400 hover:text-fg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <Tabs.List className="flex shrink-0 gap-1 border-b border-line px-2">
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'relative -mb-px h-8 border-b-2 border-transparent px-2 text-[11px] text-fg-muted transition-colors',
                  'hover:text-fg data-[state=active]:border-accent data-[state=active]:text-fg',
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {tabs.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
            >
              {tab.content}
            </Tabs.Content>
          ))}
        </Tabs.Root>

        {footer && (
          <div className="flex shrink-0 items-center gap-1.5 border-t border-line px-3 py-2">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

/** label | value row used inside detail panels */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-b border-line px-3 py-2 last:border-b-0">
      <span className="w-28 shrink-0 text-[11px] text-fg-subtle">{label}</span>
      <span className="min-w-0 flex-1 text-xs text-fg">{children ?? '—'}</span>
    </div>
  );
}
