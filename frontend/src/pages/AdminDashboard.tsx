import { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PhoneCall,
  CreditCard,
  Car,
  Clock,
  User,
  Hash,
  Calendar,
  MapPin,
  IndianRupee,
  FileText,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react';
import { useGetAllCallbackRequests, useGetAllBookingRecords, useGetAllListings } from '@/hooks/useQueries';
import type { CallbackRequest, CarListing } from '../backend';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: bigint): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-success/15 text-success border-success/30' },
    booked: { label: 'Booked', className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
    sold: { label: 'Sold', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  };
  const cfg = map[status] ?? { label: status, className: 'bg-muted text-muted-foreground border-border' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(cols)].map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Callback Requests Tab ───────────────────────────────────────────────────
function CallbackRequestsTab() {
  const { data, isLoading, isError } = useGetAllCallbackRequests();

  const sorted = useMemo<CallbackRequest[]>(() => {
    if (!data) return [];
    return [...data].sort((a, b) => Number(b.requestedAt - a.requestedAt));
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-primary" />
          Callback Requests
        </h2>
        <Badge variant="secondary" className="text-xs font-semibold">
          {sorted.length} total
        </Badge>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wide">#</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> Customer</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Phone</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> Listing ID</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Preferred Time</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Requested At</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton cols={6} />}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-destructive">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  Failed to load callback requests.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <PhoneCall className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No callback requests yet.</p>
                </TableCell>
              </TableRow>
            )}
            {sorted.map((req, idx) => (
              <TableRow key={req.id.toString()} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                <TableCell className="font-medium text-foreground">{req.customerName}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-primary font-semibold">{req.phone}</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                    #{req.listingId.toString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {req.preferredTime}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {formatTimestamp(req.requestedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Bookings & Payments Tab ─────────────────────────────────────────────────
function BookingsPaymentsTab() {
  const { data, isLoading, isError } = useGetAllBookingRecords();

  const sorted = useMemo<CarListing[]>(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const aTime = a.bookedAt ?? 0n;
      const bTime = b.bookedAt ?? 0n;
      return Number(bTime - aTime);
    });
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          Bookings & Payments
        </h2>
        <Badge variant="secondary" className="text-xs font-semibold">
          {sorted.length} total
        </Badge>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wide">#</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">Vehicle</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">Reg. No.</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> Seller</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Price</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Receipt</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Booked At</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton cols={7} />}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  Failed to load booking records.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No bookings yet.</p>
                </TableCell>
              </TableRow>
            )}
            {sorted.map((listing, idx) => (
              <TableRow key={listing.id.toString()} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground text-sm">
                    {listing.year.toString()} {listing.make} {listing.model}
                  </div>
                  <div className="text-xs text-muted-foreground">{listing.color} · {listing.city}</div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    {listing.registrationNumber || '—'}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-foreground">{listing.sellerName}</TableCell>
                <TableCell className="font-semibold text-primary text-sm">
                  {formatPrice(listing.askingPrice)}
                </TableCell>
                <TableCell>
                  {listing.receiptFileName ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success text-xs font-semibold border border-success/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {listing.receiptFileName}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 text-xs font-semibold border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {listing.bookedAt ? formatTimestamp(listing.bookedAt) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── All Listings Tab ─────────────────────────────────────────────────────────
function AllListingsTab() {
  const { data, isLoading, isError } = useGetAllListings();

  const sorted = useMemo<CarListing[]>(() => {
    if (!data) return [];
    return [...data].sort((a, b) => Number(b.postedAt - a.postedAt));
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          All Listings / Purchase Inquiries
        </h2>
        <Badge variant="secondary" className="text-xs font-semibold">
          {sorted.length} total
        </Badge>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wide">#</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> ID</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">Vehicle</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> City</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Price</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">Seller</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Phone</span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Posted At</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton cols={9} />}
            {isError && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-destructive">
                  <AlertCircle className="w-5 h-5 inline mr-2" />
                  Failed to load listings.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No listings found.</p>
                </TableCell>
              </TableRow>
            )}
            {sorted.map((listing, idx) => (
              <TableRow key={listing.id.toString()} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                    #{listing.id.toString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground text-sm">
                    {listing.year.toString()} {listing.make} {listing.model}
                  </div>
                  <div className="text-xs text-muted-foreground">{listing.color} · {listing.fuelType} · {listing.transmission}</div>
                </TableCell>
                <TableCell className="text-sm text-foreground">{listing.city}</TableCell>
                <TableCell className="font-semibold text-primary text-sm">
                  {formatPrice(listing.askingPrice)}
                </TableCell>
                <TableCell className="text-sm text-foreground">{listing.sellerName}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-primary font-semibold">{listing.sellerPhone}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={listing.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {formatTimestamp(listing.postedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { data: callbacks } = useGetAllCallbackRequests();
  const { data: bookings } = useGetAllBookingRecords();
  const { data: listings } = useGetAllListings();

  const callbackCount = callbacks?.length ?? 0;
  const bookingCount = bookings?.length ?? 0;
  const listingCount = listings?.length ?? 0;
  const availableCount = listings?.filter((l) => l.status === 'available').length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage queries, bookings, and all car listings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={Car}
            label="Total Listings"
            value={listingCount}
            accent="bg-primary/10 text-primary"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Available Cars"
            value={availableCount}
            accent="bg-success/15 text-success"
          />
          <SummaryCard
            icon={CreditCard}
            label="Bookings / Payments"
            value={bookingCount}
            accent="bg-amber-500/15 text-amber-600"
          />
          <SummaryCard
            icon={PhoneCall}
            label="Callback Requests"
            value={callbackCount}
            accent="bg-blue-500/15 text-blue-600"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="callbacks" className="space-y-6">
          <TabsList className="bg-muted border border-border h-auto p-1 gap-1 flex-wrap">
            <TabsTrigger
              value="callbacks"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-all"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Callback Requests
              {callbackCount > 0 && (
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-primary-foreground/20 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {callbackCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-all"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bookings & Payments
              {bookingCount > 0 && (
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-primary-foreground/20 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {bookingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-all"
            >
              <Car className="w-4 h-4 mr-2" />
              All Listings
              {listingCount > 0 && (
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-primary-foreground/20 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {listingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="callbacks">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <CallbackRequestsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <BookingsPaymentsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <AllListingsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
