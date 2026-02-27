import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft, Phone, MapPin, Calendar, Gauge, Fuel, Settings,
  Palette, Hash, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Images, RotateCcw, BookOpen, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGetListingById } from '../hooks/useQueries';
import CarImageViewer360 from '../components/CarImageViewer360';
import BookingModal from '../components/BookingModal';
import EmiCalculator from '../components/EmiCalculator';
import FinanceOptions from '../components/FinanceOptions';
import CallbackRequestForm from '../components/CallbackRequestForm';
import { maskPhoneNumber } from '../utils/phoneNumberMasker';

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

const CAR_PLACEHOLDER_COLORS = [
  'from-slate-200 to-slate-300',
  'from-blue-100 to-blue-200',
  'from-orange-100 to-orange-200',
  'from-green-100 to-green-200',
  'from-purple-100 to-purple-200',
];

export default function ListingDetail() {
  const { id } = useParams({ from: '/listings/$id' });
  const navigate = useNavigate();
  const listingId = BigInt(id);
  const { data: listing, isLoading, error } = useGetListingById(listingId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleCloseBookingModal = () => {
    setBookingModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-16 rounded-lg flex-shrink-0" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing || error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="font-display text-2xl font-bold mb-2">Listing Not Found</h2>
        <p className="text-muted-foreground mb-6">This car listing may have been removed or doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/listings' })} className="bg-primary text-primary-foreground">
          Browse All Cars
        </Button>
      </div>
    );
  }

  const imageUrls: string[] = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : [];
  const primaryImage = imageUrls.length > 0 ? imageUrls[activeImageIndex] : null;
  const isValidImage = primaryImage && !primaryImage.includes('example.com');
  const colorClass = CAR_PLACEHOLDER_COLORS[Number(listing.id) % CAR_PLACEHOLDER_COLORS.length];

  const has360Exterior = listing.exteriorImages360 && listing.exteriorImages360.length > 0;
  const has360Interior = listing.interiorImages360 && listing.interiorImages360.length > 0;
  const has360 = has360Exterior || has360Interior;

  const isAvailable = listing.status === 'available';
  const isBooked = listing.bookingStatus === 'booked';

  const goToPrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const specs = [
    { icon: Calendar, label: 'Year', value: listing.year.toString() },
    { icon: Gauge, label: 'Mileage', value: `${Number(listing.mileage).toLocaleString()} km` },
    { icon: Fuel, label: 'Fuel Type', value: listing.fuelType },
    { icon: Settings, label: 'Transmission', value: listing.transmission },
    { icon: Palette, label: 'Color', value: listing.color },
    { icon: MapPin, label: 'City', value: listing.city },
    { icon: Hash, label: 'Reg. Number', value: listing.registrationNumber },
    { icon: Clock, label: 'Posted', value: timeAgo(listing.postedAt) },
  ];

  const maskedPhone = maskPhoneNumber(listing.sellerPhone);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-secondary/50 border-b border-border py-3">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate({ to: '/listings' })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HD Photo Gallery */}
          <div>
            {/* Main Image */}
            <div className={`relative h-72 lg:h-96 bg-gradient-to-br ${colorClass} rounded-2xl overflow-hidden mb-3`}>
              {isValidImage ? (
                <img
                  src={`${primaryImage}&w=900&q=90&fit=crop`}
                  alt={`${listing.make} ${listing.model} - Photo ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={900}
                  height={384}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="text-7xl">🚗</div>
                  <span className="text-sm font-medium opacity-60">{listing.make} {listing.model}</span>
                </div>
              )}

              {/* Sold overlay */}
              {listing.status === 'sold' && (
                <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground text-lg font-bold px-6 py-2 rounded-full">SOLD</span>
                </div>
              )}

              {/* Booked overlay */}
              {isBooked && listing.status !== 'sold' && (
                <div className="absolute top-3 left-3">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> BOOKED
                  </span>
                </div>
              )}

              {/* Navigation arrows */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-foreground/60 hover:bg-foreground/80 text-background rounded-full p-1.5 transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground/60 hover:bg-foreground/80 text-background rounded-full p-1.5 transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo counter */}
              {imageUrls.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  {activeImageIndex + 1} / {imageUrls.length}
                </div>
              )}

              {/* HD badge */}
              {!isBooked && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold tracking-wide">
                  HD
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-primary shadow-md scale-105'
                        : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                      src={`${url}&w=120&q=70&fit=crop`}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.parentElement!.style.background = 'var(--secondary)';
                        img.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="font-display text-2xl font-bold">
                  {listing.year} {listing.make} {listing.model}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">{listing.color} · {listing.transmission}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant={isAvailable && !isBooked ? 'default' : 'destructive'}
                  className={isAvailable && !isBooked ? 'bg-green-100 text-green-700 border-green-200' : isBooked ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                >
                  {isBooked ? (
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Booked</span>
                  ) : isAvailable ? (
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Available</span>
                  ) : (
                    <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Sold</span>
                  )}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
              <p className="text-3xl font-bold text-primary">{formatPrice(listing.askingPrice)}</p>
              <p className="text-xs text-muted-foreground mt-1">Asking Price (Negotiable)</p>
            </div>

            {/* Book This Car Button */}
            {isAvailable && !isBooked && (
              <Button
                onClick={() => setBookingModalOpen(true)}
                className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Book This Car – ₹5,000
              </Button>
            )}

            {isBooked && (
              <div className="w-full mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-amber-700 text-sm font-medium">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                This car has been booked. Contact seller for availability.
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2.5">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{listing.sellerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {listing.city}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm font-medium">{maskedPhone}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Phone number is hidden for privacy. Book the car to get seller contact.
              </p>
            </div>
          </div>
        </div>

        {/* EMI Calculator */}
        <div className="mt-8">
          <EmiCalculator askingPrice={listing.askingPrice} />
        </div>

        {/* Finance Options */}
        <div className="mt-6">
          <FinanceOptions />
        </div>

        {/* Callback Request */}
        <div className="mt-6">
          <CallbackRequestForm listingId={listing.id} />
        </div>

        {/* 360° View Section */}
        {has360 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-xl">360° Interactive View</h2>
              <Badge variant="outline" className="text-xs border-primary text-primary ml-1">
                Drag to Explore
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-5">
              Explore every angle of this car — drag left or right to rotate the view.
            </p>

            <Tabs defaultValue={has360Exterior ? 'exterior' : 'interior'}>
              <TabsList className="mb-4">
                {has360Exterior && (
                  <TabsTrigger value="exterior" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Exterior 360°
                  </TabsTrigger>
                )}
                {has360Interior && (
                  <TabsTrigger value="interior" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Interior 360°
                  </TabsTrigger>
                )}
              </TabsList>

              {has360Exterior && (
                <TabsContent value="exterior">
                  <CarImageViewer360
                    images={listing.exteriorImages360}
                    label="Exterior 360°"
                  />
                </TabsContent>
              )}

              {has360Interior && (
                <TabsContent value="interior">
                  <CarImageViewer360
                    images={listing.interiorImages360}
                    label="Interior 360°"
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-3">About This Car</h3>
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate({ to: '/listings' })}
            variant="outline"
            className="flex-1 border-border"
          >
            ← Browse More Cars
          </Button>
          <Button
            onClick={() => navigate({ to: '/resale-value' })}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/5"
          >
            Check Resale Value
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      {listing && (
        <BookingModal
          open={bookingModalOpen}
          onClose={handleCloseBookingModal}
          listing={listing}
          onConfirm={() => {}}
          isLoading={false}
          isSuccess={false}
        />
      )}
    </div>
  );
}
