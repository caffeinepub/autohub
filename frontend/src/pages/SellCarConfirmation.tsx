import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, Car, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SellCarConfirmation() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { id?: string };
  const listingId = search?.id || 'N/A';

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Listing Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Your car has been successfully listed on AutoHub. Buyers can now find and contact you.
        </p>

        {/* Listing ID */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8 text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Listing ID</p>
          <p className="font-mono text-2xl font-bold text-primary">#{listingId}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Save this ID to track or manage your listing
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8 text-left">
          <h3 className="font-semibold mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              Your listing is now live and visible to buyers
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              Interested buyers will contact you directly on your phone
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              Negotiate and finalize the deal at your convenience
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/listings/$id', params: { id: listingId } })}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold"
          >
            <Car className="w-4 h-4 mr-2" /> View My Listing
          </Button>
          <Button
            onClick={() => navigate({ to: '/listings' })}
            variant="outline"
            className="w-full h-11"
          >
            <Search className="w-4 h-4 mr-2" /> Browse All Cars
          </Button>
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="ghost"
            className="w-full h-11 text-muted-foreground"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
