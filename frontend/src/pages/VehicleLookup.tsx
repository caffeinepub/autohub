import { useState } from 'react';
import { Search, Phone, MapPin, Calendar, Gauge, Fuel, Settings, Hash, CheckCircle, XCircle, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import type { CarListing } from '../backend';
import { maskPhoneNumber } from '../utils/phoneNumberMasker';

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

const CAR_PLACEHOLDER_COLORS = [
  'from-slate-200 to-slate-300',
  'from-blue-100 to-blue-200',
  'from-orange-100 to-orange-200',
  'from-green-100 to-green-200',
  'from-purple-100 to-purple-200',
];

export default function VehicleLookup() {
  const [regNumber, setRegNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CarListing | null | undefined>(undefined);
  const navigate = useNavigate();
  const { actor } = useActor();

  const handleSearch = async () => {
    const trimmed = regNumber.trim().toUpperCase();
    if (!trimmed) return;
    setIsLoading(true);
    setSearched(false);
    try {
      const res = await actor?.getListingByRegistrationNumber(trimmed);
      setResult(res ?? null);
    } catch {
      setResult(null);
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const colorClass = result
    ? CAR_PLACEHOLDER_COLORS[Number(result.id) % CAR_PLACEHOLDER_COLORS.length]
    : 'from-slate-200 to-slate-300';

  const primaryImage = result && result.imageUrls && result.imageUrls.length > 0
    ? result.imageUrls[0]
    : null;
  const isValidImage = primaryImage && !primaryImage.includes('example.com');

  const specs = result
    ? [
        { icon: Calendar, label: 'Year', value: result.year.toString() },
        { icon: Gauge, label: 'Mileage', value: `${Number(result.mileage).toLocaleString()} km` },
        { icon: Fuel, label: 'Fuel Type', value: result.fuelType },
        { icon: Settings, label: 'Transmission', value: result.transmission },
        { icon: MapPin, label: 'City', value: result.city },
        { icon: Hash, label: 'Reg. Number', value: result.registrationNumber },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Vehicle Lookup</h1>
          </div>
          <p className="text-background/70 text-sm">
            Search for any vehicle listed on AutoHub using its registration number
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Search Box */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">Enter Registration Number</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder="e.g. DL8CAF1234, MH12AB9876"
                className="pl-10 h-12 font-mono text-base tracking-wider uppercase"
                maxLength={15}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !regNumber.trim()}
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin inline-block" />
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Search
                </span>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Format: State code + district code + series + number (e.g., DL8CAF1234)
          </p>
        </div>

        {/* Sample Reg Numbers */}
        {!searched && (
          <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-6">
            <p className="text-sm font-medium mb-2">Try these sample registration numbers:</p>
            <div className="flex flex-wrap gap-2">
              {['DL8CAF1234', 'KA09BB5678', 'MH12AB9876', 'TS09CD4567', 'TN09EF4567'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegNumber(reg)}
                  className="text-xs font-mono bg-card border border-border px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result: Found */}
        {searched && result && (
          <div className="animate-fade-in space-y-5">
            {/* Found Banner */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Vehicle found! Here are the details for registration number{' '}
              <span className="font-mono font-bold">{result.registrationNumber}</span>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              {/* Car Image */}
              <div className={`relative h-56 bg-gradient-to-br ${colorClass}`}>
                {isValidImage ? (
                  <img
                    src={`${primaryImage}&w=800&q=85&fit=crop`}
                    alt={`${result.make} ${result.model}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={800}
                    height={224}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="text-6xl">🚗</div>
                    <span className="text-sm font-medium opacity-60">
                      {result.make} {result.model}
                    </span>
                  </div>
                )}
                {result.status === 'sold' && (
                  <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground text-lg font-bold px-6 py-2 rounded-full">
                      SOLD
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      result.status === 'available'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {result.status === 'available' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Sold
                      </span>
                    )}
                  </span>
                </div>
                {/* HD badge */}
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold tracking-wide">
                  HD
                </div>
              </div>

              {/* Car Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold">
                      {result.year} {result.make} {result.model}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      {result.color} · {result.transmission}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatPrice(result.askingPrice)}</p>
                    <p className="text-xs text-muted-foreground">Asking Price</p>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
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

                {/* Description */}
                {result.description && (
                  <div className="bg-secondary/30 rounded-xl p-4 mb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                  </div>
                )}

                {/* Seller Info — masked phone */}
                <div className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Seller</p>
                    <p className="font-semibold">{result.sellerName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {result.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-2">
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-medium">{maskPhoneNumber(result.sellerPhone)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Number hidden for privacy</p>
                  </div>
                </div>

                {/* View Full Listing */}
                <div className="mt-4">
                  <Button
                    onClick={() => navigate({ to: '/listings/$id', params: { id: result.id.toString() } })}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5"
                  >
                    View Full Listing →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result: Not Found */}
        {searched && result === null && (
          <div className="animate-fade-in text-center py-12 bg-card border border-border rounded-2xl shadow-card">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold mb-2">Vehicle Not Found</h3>
            <p className="text-muted-foreground text-sm mb-2 max-w-sm mx-auto">
              No vehicle with registration number{' '}
              <span className="font-mono font-semibold text-foreground">{regNumber}</span>{' '}
              was found in our database.
            </p>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
              This vehicle may not be listed on AutoHub yet, or the registration number may be incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-6">
              <Button
                onClick={() => navigate({ to: '/listings' })}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
              >
                Browse All Cars
              </Button>
              <Button
                onClick={() => navigate({ to: '/sell' })}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                List Your Car
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
