import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import CarCard from '../components/CarCard';
import LocationFilter from '../components/LocationFilter';
import { useGetAllListings } from '../hooks/useQueries';
import { PAN_INDIA_VALUE, PAN_INDIA_LABEL, getCitiesForState } from '../utils/locationData';

const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const MAKES = ['All', 'Maruti', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Toyota', 'Kia', 'Volkswagen', 'Skoda', 'MG', 'Renault', 'Nissan', 'Ford', 'Jeep'];
const TRANSMISSIONS = ['All', 'Manual', 'Automatic'];
const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under ₹3L', min: null, max: 300000 },
  { label: '₹3L – ₹5L', min: 300000, max: 500000 },
  { label: '₹5L – ₹8L', min: 500000, max: 800000 },
  { label: '₹8L – ₹12L', min: 800000, max: 1200000 },
  { label: 'Above ₹12L', min: 1200000, max: null },
];

interface Filters {
  search: string;
  make: string;
  fuelType: string;
  selectedState: string;
  selectedCity: string;
  transmission: string;
  priceRange: number;
  sortBy: string;
}

export default function Listings() {
  const { data: listings, isLoading } = useGetAllListings();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    make: 'All',
    fuelType: 'All',
    selectedState: PAN_INDIA_VALUE,
    selectedCity: PAN_INDIA_VALUE,
    transmission: 'All',
    priceRange: 0,
    sortBy: 'newest',
  });

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStateChange = (state: string) => {
    setFilters(prev => ({ ...prev, selectedState: state, selectedCity: PAN_INDIA_VALUE }));
  };

  const handleCityChange = (city: string) => {
    setFilters(prev => ({ ...prev, selectedCity: city }));
  };

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    let result = [...listings];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l =>
        l.make.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.registrationNumber.toLowerCase().includes(q)
      );
    }

    // Make
    if (filters.make !== 'All') result = result.filter(l => l.make === filters.make);

    // Fuel
    if (filters.fuelType !== 'All') result = result.filter(l => l.fuelType === filters.fuelType);

    // Location: city takes priority, then state, then pan india
    if (filters.selectedCity !== PAN_INDIA_VALUE) {
      result = result.filter(l => l.city === filters.selectedCity);
    } else if (filters.selectedState !== PAN_INDIA_VALUE) {
      const stateCities = getCitiesForState(filters.selectedState);
      result = result.filter(l => stateCities.includes(l.city));
    }

    // Transmission
    if (filters.transmission !== 'All') result = result.filter(l => l.transmission === filters.transmission);

    // Price range
    const pr = PRICE_RANGES[filters.priceRange];
    if (pr.min !== null) result = result.filter(l => Number(l.askingPrice) >= pr.min!);
    if (pr.max !== null) result = result.filter(l => Number(l.askingPrice) <= pr.max!);

    // Sort
    if (filters.sortBy === 'price-asc') result.sort((a, b) => Number(a.askingPrice) - Number(b.askingPrice));
    else if (filters.sortBy === 'price-desc') result.sort((a, b) => Number(b.askingPrice) - Number(a.askingPrice));
    else if (filters.sortBy === 'year-desc') result.sort((a, b) => Number(b.year) - Number(a.year));
    else if (filters.sortBy === 'mileage-asc') result.sort((a, b) => Number(a.mileage) - Number(b.mileage));
    else result.sort((a, b) => Number(b.postedAt) - Number(a.postedAt));

    return result;
  }, [listings, filters]);

  const activeFilterCount = [
    filters.make !== 'All',
    filters.fuelType !== 'All',
    filters.selectedState !== PAN_INDIA_VALUE,
    filters.transmission !== 'All',
    filters.priceRange !== 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      search: '',
      make: 'All',
      fuelType: 'All',
      selectedState: PAN_INDIA_VALUE,
      selectedCity: PAN_INDIA_VALUE,
      transmission: 'All',
      priceRange: 0,
      sortBy: 'newest',
    });
  };

  const locationLabel =
    filters.selectedCity !== PAN_INDIA_VALUE
      ? filters.selectedCity
      : filters.selectedState !== PAN_INDIA_VALUE
      ? filters.selectedState
      : PAN_INDIA_LABEL;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-foreground text-background py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-2">Browse Used Cars</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-background/70 text-sm">
              {isLoading ? 'Loading...' : `${filteredListings.length} cars available`}
            </p>
            <span className="flex items-center gap-1 text-background/60 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {locationLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search make, model, city, or reg. number..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="year-desc">Newest Year</SelectItem>
                <SelectItem value="mileage-asc">Lowest Mileage</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${showFilters ? 'border-primary text-primary bg-primary/5' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filter Options</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-destructive hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location Filter — State + City */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
                <LocationFilter
                  selectedState={filters.selectedState}
                  selectedCity={filters.selectedCity}
                  onStateChange={handleStateChange}
                  onCityChange={handleCityChange}
                  compact
                />
              </div>

              {/* Make */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Make</label>
                <Select value={filters.make} onValueChange={(v) => updateFilter('make', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAKES.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuel Type</label>
                <Select value={filters.fuelType} onValueChange={(v) => updateFilter('fuelType', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Transmission</label>
                <Select value={filters.transmission} onValueChange={(v) => updateFilter('transmission', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price Range</label>
                <Select
                  value={filters.priceRange.toString()}
                  onValueChange={(v) => updateFilter('priceRange', parseInt(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((pr, i) => (
                      <SelectItem key={i} value={i.toString()}>{pr.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Active location indicator */}
        {(filters.selectedState !== PAN_INDIA_VALUE || filters.selectedCity !== PAN_INDIA_VALUE) && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Showing results for:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {locationLabel}
              <button
                onClick={() => {
                  updateFilter('selectedState', PAN_INDIA_VALUE);
                  updateFilter('selectedCity', PAN_INDIA_VALUE);
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold mb-2">No Cars Found</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Try adjusting your filters or search query to find more results.
            </p>
            <Button onClick={clearFilters} variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <CarCard key={listing.id.toString()} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
