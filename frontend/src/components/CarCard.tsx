import { CarListing } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, Gauge, MapPin, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface CarCardProps {
  listing: CarListing;
}

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function CarCard({ listing }: CarCardProps) {
  const primaryImage =
    listing.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls[0]
      : null;

  // Only use image if it's a real HTTP URL; local paths like /images/... don't exist
  const hasValidImage = primaryImage !== null && isHttpUrl(primaryImage);

  const isBooked =
    listing.bookingStatus === "booked" || listing.status === "booked";

  return (
    <Link to="/listings/$id" params={{ id: listing.id.toString() }}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border bg-card h-full">
        {/* Image Area */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {hasValidImage ? (
            <img
              src={primaryImage!}
              alt={`${listing.year} ${listing.make} ${listing.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
          ) : null}
          {/* Placeholder — shown when no valid image or image fails to load */}
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/60"
            style={{ display: hasValidImage ? "none" : "flex" }}
          >
            <span className="text-5xl mb-2">🚗</span>
            <span className="text-muted-foreground text-sm font-medium">
              {listing.make} {listing.model}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            <Badge variant="secondary" className="text-xs font-semibold">
              {listing.fuelType}
            </Badge>
            <Badge variant="outline" className="text-xs bg-card/80 backdrop-blur-sm">
              {listing.transmission}
            </Badge>
          </div>

          {isBooked && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 text-white text-xs font-bold">
                Booked
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
              {listing.year} {listing.make} {listing.model}
            </h3>
            <p className="text-muted-foreground text-sm">{listing.color}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 shrink-0" />
              <span>{Number(listing.mileage).toLocaleString("en-IN")} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{Number(listing.year)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 shrink-0" />
              <span>{listing.fuelType}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{listing.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xl font-bold text-primary">
              {formatPrice(listing.askingPrice)}
            </span>
            <span className="text-xs text-muted-foreground">
              by {listing.sellerName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
