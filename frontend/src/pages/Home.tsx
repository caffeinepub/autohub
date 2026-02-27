import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, TrendingUp, Shield, Award, ChevronRight, Car, DollarSign, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import CarCard from '../components/CarCard';
import LocationFilter from '../components/LocationFilter';
import { useGetAllListings } from '../hooks/useQueries';
import { PAN_INDIA_VALUE, getCitiesForState } from '../utils/locationData';

const POPULAR_MAKES = ['Maruti', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Toyota', 'Kia', 'Volkswagen'];

const STATS = [
  { label: 'Cars Listed', value: '10,000+', icon: Car },
  { label: 'Happy Customers', value: '50,000+', icon: Award },
  { label: 'Cities Covered', value: '100+', icon: Shield },
  { label: 'Avg. Savings', value: '₹1.2L', icon: TrendingUp },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(PAN_INDIA_VALUE);
  const [selectedCity, setSelectedCity] = useState(PAN_INDIA_VALUE);
  const navigate = useNavigate();
  const { data: listings, isLoading } = useGetAllListings();

  // Filter featured listings by location
  const featuredListings = (listings ?? [])
    .filter((l) => {
      if (l.status !== 'available') return false;
      if (selectedCity !== PAN_INDIA_VALUE) return l.city === selectedCity;
      if (selectedState !== PAN_INDIA_VALUE) {
        const stateCities = getCitiesForState(selectedState);
        return stateCities.includes(l.city);
      }
      return true;
    })
    .slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: '/listings', search: { q: searchQuery } as any });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[560px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-banner.dim_1440x500.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />

        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              India's Trusted Used Car Marketplace
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Find Your Perfect
              <span className="text-primary"> Pre-Owned Car</span>
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
              Browse thousands of verified second-hand cars. Get the best price for your car or find your dream ride.
            </p>

            {/* Search Bar + Location Filter side by side */}
            <div className="max-w-2xl mx-auto space-y-2">
              {/* Location Filter Row */}
              <LocationFilter
                selectedState={selectedState}
                selectedCity={selectedCity}
                onStateChange={setSelectedState}
                onCityChange={setSelectedCity}
                className="w-full"
              />

              {/* Search Row */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model..."
                    className="pl-10 h-12 bg-white/95 border-0 text-foreground placeholder:text-muted-foreground shadow-hero text-sm"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-hero">
                  Search
                </Button>
              </form>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Under ₹5L', 'Under ₹10L', 'Diesel', 'Automatic', 'SUV'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate({ to: '/listings' })}
                  className="text-xs text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full transition-colors backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">{value}</p>
                  <p className="text-xs opacity-80">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center mb-8">What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Car,
                title: 'Sell My Car',
                desc: 'List your car and reach thousands of buyers. Get the best price.',
                path: '/sell',
                color: 'bg-orange-50 border-orange-200 hover:border-primary',
                iconBg: 'bg-primary',
              },
              {
                icon: DollarSign,
                title: 'Check Resale Value',
                desc: "Get an instant estimate of your car's current market value.",
                path: '/resale-value',
                color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
                iconBg: 'bg-blue-500',
              },
              {
                icon: FileSearch,
                title: 'Vehicle Lookup',
                desc: 'Search any vehicle details using its registration number.',
                path: '/vehicle-lookup',
                color: 'bg-green-50 border-green-200 hover:border-green-400',
                iconBg: 'bg-green-500',
              },
            ].map(({ icon: Icon, title, desc, path, color, iconBg }) => (
              <button
                key={path}
                onClick={() => navigate({ to: path as any })}
                className={`${color} border-2 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 group`}
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Makes */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-6">Browse by Brand</h2>
          <div className="flex flex-wrap gap-3">
            {POPULAR_MAKES.map((make) => (
              <button
                key={make}
                onClick={() => navigate({ to: '/listings' })}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-xs"
              >
                <span className="text-lg">🚗</span>
                {make}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold">Featured Cars</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedState !== PAN_INDIA_VALUE
                  ? selectedCity !== PAN_INDIA_VALUE
                    ? `Showing cars in ${selectedCity}`
                    : `Showing cars in ${selectedState}`
                  : 'Handpicked quality vehicles for you'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/listings' })}
              className="hidden md:flex items-center gap-1 border-primary text-primary hover:bg-primary/5"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-medium">No cars found for the selected location.</p>
              <p className="text-sm mt-1">Try selecting a different state or city.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <CarCard key={listing.id.toString()} listing={listing} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/listings' })}
              className="border-primary text-primary hover:bg-primary/5"
            >
              View All Cars <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why AutoHub */}
      <section className="py-14 bg-secondary/40">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center mb-10">Why Choose AutoHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Verified Listings', desc: 'Every car listing is verified for authenticity and accuracy before going live.' },
              { icon: TrendingUp, title: 'Best Market Price', desc: 'Our AI-powered pricing tool ensures you get the best deal whether buying or selling.' },
              { icon: Award, title: 'Trusted by Thousands', desc: 'Over 50,000 happy customers have bought and sold cars through AutoHub.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
