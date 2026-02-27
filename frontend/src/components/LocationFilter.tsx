import { MapPin, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDIA_STATES, PAN_INDIA_VALUE, PAN_INDIA_LABEL } from '../utils/locationData';

interface LocationFilterProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  className?: string;
  compact?: boolean;
}

export default function LocationFilter({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  className = '',
  compact = false,
}: LocationFilterProps) {
  const currentStateCities =
    selectedState !== PAN_INDIA_VALUE
      ? INDIA_STATES.find((s) => s.name === selectedState)?.cities ?? []
      : [];

  const handleStateChange = (value: string) => {
    onStateChange(value);
    onCityChange(PAN_INDIA_VALUE); // reset city when state changes
  };

  const stateLabel =
    selectedState === PAN_INDIA_VALUE ? PAN_INDIA_LABEL : selectedState;
  const cityLabel =
    selectedCity === PAN_INDIA_VALUE ? 'All Cities' : selectedCity;

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {/* State Selector */}
      <div className="flex-1 min-w-0">
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger
            className={`w-full bg-white/95 border-0 text-foreground shadow-sm ${
              compact ? 'h-10 text-sm' : 'h-12'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{stateLabel}</span>
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-y-auto">
            <SelectItem value={PAN_INDIA_VALUE}>
              <span className="flex items-center gap-2 font-semibold text-primary">
                🇮🇳 {PAN_INDIA_LABEL}
              </span>
            </SelectItem>
            <SelectGroup>
              <SelectLabel className="text-xs text-muted-foreground px-2 py-1">
                States &amp; Union Territories
              </SelectLabel>
              {INDIA_STATES.map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* City Selector — only shown when a state is selected */}
      {selectedState !== PAN_INDIA_VALUE && currentStateCities.length > 0 && (
        <div className="flex-1 min-w-0">
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger
              className={`w-full bg-white/95 border-0 text-foreground shadow-sm ${
                compact ? 'h-10 text-sm' : 'h-12'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{cityLabel}</span>
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectItem value={PAN_INDIA_VALUE}>
                <span className="font-medium">All Cities in {selectedState}</span>
              </SelectItem>
              {currentStateCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
