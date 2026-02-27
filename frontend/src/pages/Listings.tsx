import { useState, useMemo } from "react";
import { useGetAllListings } from "@/hooks/useQueries";
import CarCard from "@/components/CarCard";
import LocationFilter from "@/components/LocationFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PAN_INDIA_VALUE } from "@/utils/locationData";

const FUEL_TYPES = ["All", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSION_TYPES = ["All", "Manual", "Automatic"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "mileage-asc", label: "Mileage: Low to High" },
  { value: "year-desc", label: "Year: Newest" },
];

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function Listings() {
  const { data: listings = [], isLoading, error } = useGetAllListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedState, setSelectedState] = useState(PAN_INDIA_VALUE);
  const [selectedCity, setSelectedCity] = useState(PAN_INDIA_VALUE);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.make.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.color.toLowerCase().includes(q)
      );
    }

    // Fuel type filter
    if (selectedFuel !== "All") {
      result = result.filter((l) => l.fuelType === selectedFuel);
    }

    // Transmission filter
    if (selectedTransmission !== "All") {
      result = result.filter((l) => l.transmission === selectedTransmission);
    }

    // Location filter — city takes priority over state
    if (selectedCity && selectedCity !== PAN_INDIA_VALUE) {
      result = result.filter((l) => l.city === selectedCity);
    }

    // Price filters
    if (minPrice) {
      const min = parseFloat(minPrice) * 100000;
      result = result.filter((l) => Number(l.askingPrice) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice) * 100000;
      result = result.filter((l) => Number(l.askingPrice) <= max);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.askingPrice) - Number(b.askingPrice);
        case "price-desc":
          return Number(b.askingPrice) - Number(a.askingPrice);
        case "mileage-asc":
          return Number(a.mileage) - Number(b.mileage);
        case "year-desc":
          return Number(b.year) - Number(a.year);
        case "newest":
        default:
          return Number(b.postedAt) - Number(a.postedAt);
      }
    });

    return result;
  }, [listings, searchQuery, selectedFuel, selectedTransmission, selectedCity, minPrice, maxPrice, sortBy]);

  const activeFilterCount = [
    selectedFuel !== "All",
    selectedTransmission !== "All",
    selectedCity !== PAN_INDIA_VALUE,
    !!minPrice,
    !!maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedFuel("All");
    setSelectedTransmission("All");
    setSelectedState(PAN_INDIA_VALUE);
    setSelectedCity(PAN_INDIA_VALUE);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-1">Browse Cars</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Loading listings..."
              : `${filteredListings.length} car${filteredListings.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                <LocationFilter
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={setSelectedState}
                  onCityChange={setSelectedCity}
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {FUEL_TYPES.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setSelectedFuel(fuel)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedFuel === fuel
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Transmission</label>
                <div className="flex flex-wrap gap-2">
                  {TRANSMISSION_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTransmission(t)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedTransmission === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Price Range (in Lakhs)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="Min (e.g. 3)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-36"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    placeholder="Max (e.g. 20)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-36"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg font-medium">Failed to load listings</p>
            <p className="text-muted-foreground mt-1">Please try refreshing the page.</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-xl font-semibold text-foreground mb-2">No cars found</p>
            <p className="text-muted-foreground mb-4">
              {listings.length === 0
                ? "No listings available yet. Be the first to list your car!"
                : "Try adjusting your filters or search query."}
            </p>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <CarCard key={listing.id.toString()} listing={listing} />
            ))}
          </div>
        )}

        {/* Price summary */}
        {!isLoading && filteredListings.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span>
              Price range:{" "}
              <strong className="text-foreground">
                {formatPrice(
                  filteredListings.reduce(
                    (min, l) => (l.askingPrice < min ? l.askingPrice : min),
                    filteredListings[0].askingPrice
                  )
                )}
              </strong>{" "}
              –{" "}
              <strong className="text-foreground">
                {formatPrice(
                  filteredListings.reduce(
                    (max, l) => (l.askingPrice > max ? l.askingPrice : max),
                    filteredListings[0].askingPrice
                  )
                )}
              </strong>
            </span>
            <span>
              Avg. mileage:{" "}
              <strong className="text-foreground">
                {Math.round(
                  filteredListings.reduce((sum, l) => sum + Number(l.mileage), 0) /
                    filteredListings.length
                ).toLocaleString("en-IN")}{" "}
                km
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
