import { Badge } from '@/components/ui/badge';
import { formatStatusLabel, rentalStatusTone } from './rental-utils';

type RentalStatusBadgeProps = {
  status: string;
  /** Rendered as "Overdue" whatever the stored status says */
  overdue?: boolean;
};

export function RentalStatusBadge({ status, overdue = false }: RentalStatusBadgeProps) {
  if (overdue && status !== 'Overdue') {
    return (
      <Badge tone="danger" title={`Stored status: ${status}`}>
        Overdue
      </Badge>
    );
  }

  return <Badge tone={rentalStatusTone(status)}>{formatStatusLabel(status)}</Badge>;
}
