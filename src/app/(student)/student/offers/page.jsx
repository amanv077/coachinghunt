import { listActiveOffers } from "@/modules/offers/offers.service";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PromoCodeChip } from "@/components/shared/PromoCodeChip";

export default async function StudentOffersPage() {
  const offers = await listActiveOffers();

  return (
    <div>
      <h1 className="text-2xl font-bold">Offers</h1>
      <p className="text-muted">Active promotions from coaching institutes</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {offers.length === 0 ? (
          <EmptyState title="No active offers" description="Check back later for new promotions." />
        ) : (
          offers.map((offer) => (
            <Card key={offer.id}>
              <p className="font-medium">{offer.title}</p>
              <p className="text-sm text-primary">{offer.coaching.name}</p>
              {offer.description && <p className="mt-2 text-sm text-muted">{offer.description}</p>}
              <PromoCodeChip code={offer.promoCode} />
              <p className="mt-2 text-xs text-muted">Valid till {new Date(offer.validTill).toLocaleDateString()}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
