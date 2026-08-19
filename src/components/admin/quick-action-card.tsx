import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

type QuickActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function QuickActionCard({
  href,
  title,
  description,
  icon: IconComponent,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-md border border-line bg-surface-200 p-3 transition-colors hover:border-line-strong hover:bg-surface-300"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface-300 text-fg-muted group-hover:text-accent-text">
        <IconComponent className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-fg">{title}</span>
        <span className="block truncate text-[11px] text-fg-subtle">{description}</span>
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
    </Link>
  );
}
