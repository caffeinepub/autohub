import { Link } from '@tanstack/react-router';
import { Fuel, Gauge, Calendar, MapPin, RotateCcw, BookOpen } from 'lucide-react';
import type { CarListing } from '../backend';

interface CarCardProps {
  listing: CarListing;
}

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

const fuelColors: Record<string, string> = {
  Petrol: 'bg-blue-50 text-blue-700 border-blue-200',
  Diesel: 'bg-amber-50 text-amber-700 border-amber-200',
  CNG: 'bg-green-50 text-green-700 border-green-200',
  Electric: 'bg-purple-50 text-purple-700 border-purple-200',
  Hybrid: 'bg-teal-50 text-teal-700 border-teal-200',
};

const CAR_PLACEHOLDER_COLORS = [
  'from-slate-200 to-slate-300',
  'from-blue-100 to-blue-200',
  'from-orange-100 to-orange-200',
  'from-green-100 to-green-200',
  'from-purple-100 to-purple-200',
];

export default function CarCard({ listing }: CarCardProps) {
  const primaryImage = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : null;
  const isValidImage = primaryImage && !primaryImage.includes('example.com');
  const colorClass = CAR_PLACEHOLDER_COLORS[Number(listing.id) % CAR_PLACEHOLDER_COLORS.length];
  const fuelClass = fuelColors[listing.fuelType] || 'bg-gray-50 text-gray-700 border-gray-200';
  const has360 = (listing.exteriorImages360 && listing.exteriorImages360.length > 0) ||
    (listing.interiorImages360 && listing.interiorImages360.length > 0);
  const isBooked = listing.bookingStatus === 'booked';

  return (
    <Link to="/listings/$id" params={{ id: listing.id.toString() }}>
      <div className="bg-card rounded-xl border border-border shadow-card card-hover overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className={`relative h-44 bg-gradient-to-br ${colorClass} overflow-hidden`}>
          {isValidImage ? (
            <img
              src={`${primaryImage}&w=600&q=85&fit=crop`}
              alt={`${listing.make} ${listing.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={176}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="text-4xl">🚗</div>
              <span className="text-xs font-medium opacity-60">{listing.make} {listing.model}</span>
            </div>
          )}

          {/* Sold overlay */}
          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">SOLD</span>
            </div>
          )}

          {/* Booked badge */}
          {isBooked && listing.status !== 'sold' && (
            <div className="absolute top-2 left-2">
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                <BookOpen className="w-3 h-3" /> Booked
              </span>
            </div>
          )}

          {/* Fuel badge */}
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${fuelClass}`}>
              {listing.fuelType}
            </span>
          </div>

          {/* 360 badge */}
          {has360 && (
            <div className="absolute bottom-2 left-2">
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-foreground/80 text-background border border-background/20">
                <RotateCcw className="w-3 h-3" /> 360°
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {listing.imageUrls && listing.imageUrls.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-foreground/70 text-background">
                📷 {listing.imageUrls.length}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-display font-semibold text-base text-foreground leading-tight">
              {listing.year} {listing.make} {listing.model}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{listing.color} · {listing.transmission}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {Number(listing.mileage).toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {listing.year.toString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {listing.city}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">{formatPrice(listing.askingPrice)}</p>
              <p className="text-xs text-muted-foreground">Asking Price</p>
            </div>
            <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
