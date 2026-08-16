import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { TONE_SURFACES, type SurfaceTone } from '@/components/ui/tone';

type StatCardProps = {
  label: string;
  value: number;
  icon: IconName;
  tone: SurfaceTone;
  href: string;
};

export function StatCard({ label, value, icon, tone, href }: StatCardProps) {
  return (
    <Card className="transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <Link href={href} className="flex items-center justify-between p-4 lg:p-6">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 lg:text-3xl dark:text-zinc-50">
            {value}
          </p>
        </div>
        <div className={`rounded-lg p-2 lg:p-3 ${TONE_SURFACES[tone]}`}>
          <Icon name={icon} className="h-5 w-5 lg:h-6 lg:w-6" />
        </div>
      </Link>
    </Card>
  );
}
