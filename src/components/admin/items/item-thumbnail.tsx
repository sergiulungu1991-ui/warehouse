import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Square item preview with a neutral placeholder when no image exists */
export function ItemThumbnail({
  url,
  name,
  className = 'h-8 w-8',
}: {
  url?: string;
  name: string;
  className?: string;
}) {
  if (!url) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded border border-line bg-surface-300',
          className,
        )}
      >
        <ImageIcon className="h-3.5 w-3.5 text-fg-subtle" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      className={cn('shrink-0 rounded border border-line object-cover', className)}
    />
  );
}
