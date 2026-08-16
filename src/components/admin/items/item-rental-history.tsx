import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemRentalRow } from './item-rental-row';
import {
  ACTIVE_RENTAL_STATUSES,
  CLOSED_RENTAL_STATUSES,
  type ItemRental,
} from './item-rental-types';

type ItemRentalSectionsProps = {
  rentals: ItemRental[];
};

function RentalGroup({
  title,
  rentals,
  emptyTitle,
  emptyDescription,
  tone,
}: {
  title: string;
  rentals: ItemRental[];
  emptyTitle: string;
  emptyDescription: string;
  tone: 'warning' | 'neutral';
}) {
  return (
    <Card className="mt-6">
      <CardHeader
        title={title}
        actions={<Badge tone={rentals.length ? tone : 'neutral'}>{rentals.length}</Badge>}
      />
      {rentals.length > 0 ? (
        <CardBody className="space-y-2">
          {rentals.map((rental) => (
            <ItemRentalRow key={rental.id} rental={rental} />
          ))}
        </CardBody>
      ) : (
        <EmptyState icon="calendar" title={emptyTitle} description={emptyDescription} />
      )}
    </Card>
  );
}

export function ItemRentalSections({ rentals }: ItemRentalSectionsProps) {
  const active = rentals.filter((rental) => ACTIVE_RENTAL_STATUSES.includes(rental.status));
  const history = rentals.filter((rental) => CLOSED_RENTAL_STATUSES.includes(rental.status));

  return (
    <>
      <RentalGroup
        title="Currently rented"
        rentals={active}
        tone="warning"
        emptyTitle="Nothing is out right now"
        emptyDescription="Every unit of this item is back in the warehouse."
      />
      <RentalGroup
        title="Rental history"
        rentals={history}
        tone="neutral"
        emptyTitle="No past rentals"
        emptyDescription="Returned and canceled rentals will show up here."
      />
    </>
  );
}
