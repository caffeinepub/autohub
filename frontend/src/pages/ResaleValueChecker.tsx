import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateResaleValue, formatPrice, type ResaleInput, type ResaleResult } from '../utils/resaleCalculator';

const MAKES = ['Maruti', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Toyota', 'Kia', 'Volkswagen', 'Ford', 'Renault', 'Nissan', 'Skoda', 'MG'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

export default function ResaleValueChecker() {
  const [form, setForm] = useState<Partial<ResaleInput>>({});
  const [result, setResult] = useState<ResaleResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof ResaleInput, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.make) newErrors.make = 'Required';
    if (!form.model) newErrors.model = 'Required';
    if (!form.year) newErrors.year = 'Required';
    if (!form.mileage && form.mileage !== 0) newErrors.mileage = 'Required';
    if (!form.fuelType) newErrors.fuelType = 'Required';
    if (!form.transmission) newErrors.transmission = 'Required';
    if (!form.city) newErrors.city = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateResaleValue(form as ResaleInput);
    setResult(res);
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const impactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    if (impact === 'positive') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (impact === 'negative') return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const impactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    if (impact === 'positive') return 'bg-green-50 border-green-200';
    if (impact === 'negative') return 'bg-red-50 border-red-200';
    return 'bg-secondary/50 border-border';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Car Resale Value Checker</h1>
          </div>
          <p className="text-background/70 text-sm ml-13">
            Get an instant estimate of your car's current market value based on age, mileage, and market factors.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>This is an estimated value based on market trends and depreciation formulas. Actual resale price may vary based on car condition, service history, and local demand.</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <h2 className="font-display font-semibold text-lg mb-5">Enter Car Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Brand *</Label>
              <Select value={form.make || ''} onValueChange={(v) => update('make', v)}>
                <SelectTrigger className={errors.make ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {MAKES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.make && <p className="text-destructive text-xs mt-1">{errors.make}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Model *</Label>
              <Input
                value={form.model || ''}
                onChange={(e) => update('model', e.target.value)}
                placeholder="e.g. Swift, Creta, Nexon"
                className={errors.model ? 'border-destructive' : ''}
              />
              {errors.model && <p className="text-destructive text-xs mt-1">{errors.model}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Year of Purchase *</Label>
              <Select value={form.year?.toString() || ''} onValueChange={(v) => update('year', parseInt(v))}>
                <SelectTrigger className={errors.year ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-destructive text-xs mt-1">{errors.year}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Current Mileage (km) *</Label>
              <Input
                type="number"
                value={form.mileage?.toString() || ''}
                onChange={(e) => update('mileage', parseInt(e.target.value) || 0)}
                placeholder="e.g. 45000"
                className={errors.mileage ? 'border-destructive' : ''}
              />
              {errors.mileage && <p className="text-destructive text-xs mt-1">{errors.mileage}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Fuel Type *</Label>
              <Select value={form.fuelType || ''} onValueChange={(v) => update('fuelType', v)}>
                <SelectTrigger className={errors.fuelType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select fuel" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-destructive text-xs mt-1">{errors.fuelType}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Transmission *</Label>
              <Select value={form.transmission || ''} onValueChange={(v) => update('transmission', v)}>
                <SelectTrigger className={errors.transmission ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.transmission && <p className="text-destructive text-xs mt-1">{errors.transmission}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm font-medium mb-1.5 block">City *</Label>
              <Select value={form.city || ''} onValueChange={(v) => update('city', v)}>
                <SelectTrigger className={errors.city ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full mt-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Resale Value
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div id="result-section" className="animate-fade-in space-y-5">
            {/* Price Range */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center shadow-card">
              <p className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">Estimated Resale Value</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">{formatPrice(result.minPrice)}</span>
                <span className="text-muted-foreground font-medium">–</span>
                <span className="text-3xl font-bold text-primary">{formatPrice(result.maxPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Base market price: {formatPrice(result.basePrice)} (before depreciation)
              </p>
            </div>

            {/* Factor Breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-semibold text-lg mb-4">Price Factor Breakdown</h3>
              <div className="space-y-3">
                {result.factors.map((factor) => (
                  <div
                    key={factor.label}
                    className={`flex items-center justify-between p-3 rounded-xl border ${impactColor(factor.impact)}`}
                  >
                    <div className="flex items-center gap-3">
                      {impactIcon(factor.impact)}
                      <div>
                        <p className="text-sm font-medium">{factor.label}</p>
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        factor.adjustment > 0 ? 'text-green-600' :
                        factor.adjustment < 0 ? 'text-destructive' :
                        'text-muted-foreground'
                      }`}>
                        {factor.adjustment > 0 ? '+' : ''}{factor.adjustment}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
              <p className="font-medium mb-1">Ready to sell your car?</p>
              <p className="text-sm text-muted-foreground mb-4">List it on AutoHub and reach thousands of buyers</p>
              <Button
                onClick={() => window.location.href = '/sell'}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                List My Car Now →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
