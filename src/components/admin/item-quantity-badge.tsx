import { Badge, type BadgeTone } from '@/components/ui/badge';

const toneForQuantity = (available: number, total: number): BadgeTone => {
  if (available === 0) return 'danger';
  if (available < total) return 'warning';
  return 'success';
};

export function ItemQuantityBadge({ available, total }: { available: number; total: number }) {
  return (
    <Badge tone={toneForQuantity(available, total)} title={`${available} of ${total} available`}>
      <span className="font-mono">
        {available}/{total}
      </span>
    </Badge>
  );
}
