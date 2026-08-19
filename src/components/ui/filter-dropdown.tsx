'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FilterOption = {
  value: string;
  label: string;
  /** Indentation level, used to render category hierarchies */
  depth?: number;
};

type FilterDropdownProps = {
  label: string;
  icon?: LucideIcon;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  /** Value that means "no filter", rendered without the active highlight */
  neutralValue?: string;
  className?: string;
};

const TRIGGER_CLASS =
  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface-200 px-2.5 text-xs text-fg transition-colors hover:border-line-strong hover:bg-surface-300 data-[state=open]:bg-surface-300';

export function FilterDropdown({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  neutralValue,
  className,
}: FilterDropdownProps) {
  const selected = options.find((option) => option.value === value);
  const isActive = neutralValue !== undefined && value !== neutralValue;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(TRIGGER_CLASS, isActive && 'border-accent/40 text-accent-text', className)}
        aria-label={label}
      >
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />}
        <span className="max-w-32 truncate">{selected?.label ?? label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 max-h-72 min-w-44 overflow-y-auto rounded-md border border-line bg-surface-300 p-1 shadow-lg shadow-black/30"
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => onChange(option.value)}
              className="flex h-7 cursor-pointer items-center gap-2 rounded px-2 text-xs text-fg-muted outline-none data-[highlighted]:bg-surface-400 data-[highlighted]:text-fg"
              style={{ paddingLeft: `${8 + (option.depth ?? 0) * 12}px` }}
            >
              <span className="flex h-3 w-3 shrink-0 items-center justify-center">
                {option.value === value && <Check className="h-3 w-3 text-accent" />}
              </span>
              <span className="truncate">{option.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
