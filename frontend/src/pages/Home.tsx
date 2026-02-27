import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetAllListings } from "@/hooks/useQueries";
import CarCard from "@/components/CarCard";
import LocationFilter from "@/components/LocationFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight, Shield, Star, Zap } from "lucide-react";
import { PAN_INDIA_VALUE, getCitiesForState } from "@/utils/locationData";

export default function Home() {
  const navigate = useNavigate();
  const { data: listings = [], isLoading } = useGetAllListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState(PAN_INDIA_VALUE);
  const [selectedCity, setSelectedCity] = useState(PAN_INDIA_VALUE);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedCity && selectedCity !== PAN_INDIA_VALUE) params.city = selectedCity;
    navigate({ to: "/listings", search: params as never });
  };

  // Featured listings: available cars, up to 8
  const featuredListings = useMemo(() => {
    return listings
      .filter((l) => l.status === "available")
      .slice(0, 8);
  }, [listings]);

  const stats = [
    { label: "Cars Listed", value: `${listings.length}+` },
    { label: "Cities Covered", value: "50+" },
    { label: "Happy Buyers", value: "1000+" },
    { label: "Verified Sellers", value: "500+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
            Find Your Perfect{" "}
            <span className="text-primary">Pre-Owned Car</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Browse thousands of verified used cars across India. Transparent pricing, trusted sellers.
          </p>

          {/* Search Box */}
          <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search make, model, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 h-11"
                />
              </div>
              <div className="shrink-0">
                <LocationFilter
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={(s) => {
                    setSelectedState(s);
                    setSelectedCity(PAN_INDIA_VALUE);
                  }}
                  onCityChange={setSelectedCity}
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="shrink-0 h-11">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Cars</h2>
              <p className="text-muted-foreground mt-1">Hand-picked listings for you</p>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: "/listings" })}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <span className="text-5xl mb-3 block">🚗</span>
              <p className="text-lg font-semibold text-foreground">No listings yet</p>
              <p className="text-muted-foreground mt-1 mb-4">Be the first to list your car!</p>
              <Button onClick={() => navigate({ to: "/sell" })}>List Your Car</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <CarCard key={listing.id.toString()} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why AutoHub */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Why Choose AutoHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Verified Listings",
                desc: "Every listing is reviewed for accuracy. Buy with confidence.",
              },
              {
                icon: <Star className="w-8 h-8 text-primary" />,
                title: "Best Prices",
                desc: "Compare prices across thousands of cars to get the best deal.",
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "Fast & Easy",
                desc: "List your car in minutes or find your dream car in seconds.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Sell Your Car?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            List your car for free and reach thousands of buyers across India.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate({ to: "/sell" })}
          >
            List Your Car for Free
          </Button>
        </div>
      </section>
    </div>
  );
}
