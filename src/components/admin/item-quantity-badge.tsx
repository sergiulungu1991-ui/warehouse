import { Badge, type BadgeTone } from '@/components/ui/badge';

const toneForQuantity = (available: number): BadgeTone => {
  if (available > 10) return 'success';
  if (available > 0) return 'warning';
  return 'danger';
};

export function ItemQuantityBadge({ available, total }: { available: number; total: number }) {
  return (
    <Badge tone={toneForQuantity(available)} title={`${available} of ${total} available`}>
      {available} / {total}
    </Badge>
  );
}
