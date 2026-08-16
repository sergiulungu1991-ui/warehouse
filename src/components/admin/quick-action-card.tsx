import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/icon';
import { TONE_SURFACES, type SurfaceTone } from '@/components/ui/tone';

type QuickActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: IconName;
  tone: SurfaceTone;
};

export function QuickActionCard({ href, title, description, icon, tone }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className={`rounded-lg p-2 ${TONE_SURFACES[tone]}`}>
        <Icon name={icon} />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </Link>
  );
}
