import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, ChevronLeft, Car, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateListing } from '../hooks/useQueries';
import { toast } from 'sonner';

const MAKES = ['Maruti', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Toyota', 'Kia', 'Volkswagen', 'Ford', 'Renault', 'Nissan', 'Skoda', 'MG', 'Other'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const COLORS = ['White', 'Silver', 'Black', 'Grey', 'Red', 'Blue', 'Brown', 'Green', 'Yellow', 'Orange', 'Other'];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Other'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

interface FormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  color: string;
  registrationNumber: string;
  city: string;
  askingPrice: string;
  sellerName: string;
  sellerPhone: string;
  description: string;
  imageUrl: string; // Single URL input from user; wrapped into imageUrls[] on submit
}

const INITIAL_FORM: FormData = {
  make: '', model: '', year: '', mileage: '', fuelType: '', transmission: '',
  color: '', registrationNumber: '', city: '', askingPrice: '', sellerName: '',
  sellerPhone: '', description: '', imageUrl: '',
};

export default function SellCar() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();
  const createListing = useCreateListing();

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.make) newErrors.make = 'Brand is required';
    if (!form.model) newErrors.model = 'Model is required';
    if (!form.year) newErrors.year = 'Year is required';
    if (!form.mileage) newErrors.mileage = 'Mileage is required';
    if (!form.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!form.transmission) newErrors.transmission = 'Transmission is required';
    if (!form.color) newErrors.color = 'Color is required';
    if (!form.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.city) newErrors.city = 'City is required';
    if (!form.askingPrice || isNaN(Number(form.askingPrice)) || Number(form.askingPrice) <= 0)
      newErrors.askingPrice = 'Valid asking price is required';
    if (!form.sellerName) newErrors.sellerName = 'Your name is required';
    if (!form.sellerPhone || !/^\d{10}$/.test(form.sellerPhone))
      newErrors.sellerPhone = 'Valid 10-digit phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    try {
      const id = await createListing.mutateAsync({
        make: form.make,
        model: form.model,
        year: BigInt(form.year),
        mileage: BigInt(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        color: form.color,
        city: form.city,
        askingPrice: BigInt(form.askingPrice),
        sellerName: form.sellerName,
        sellerPhone: form.sellerPhone,
        description: form.description,
        // Wrap the single user-provided URL into the imageUrls array
        imageUrls: form.imageUrl ? [form.imageUrl] : [],
        exteriorImages360: [],
        interiorImages360: [],
        registrationNumber: form.registrationNumber.toUpperCase(),
      });
      navigate({ to: '/sell/confirmation', search: { id: id.toString() } as any });
    } catch (err) {
      toast.error('Failed to submit listing. Please try again.');
    }
  };

  const steps = [
    { num: 1, label: 'Vehicle Details', icon: Car },
    { num: 2, label: 'Contact & Price', icon: User },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-foreground text-background py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl font-bold mb-1">Sell Your Car</h1>
          <p className="text-background/70 text-sm">List your car and reach thousands of buyers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  step > s.num ? 'bg-primary border-primary text-primary-foreground' :
                  step === s.num ? 'border-primary text-primary bg-primary/10' :
                  'border-border text-muted-foreground'
                }`}>
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display font-semibold text-xl flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" /> Vehicle Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Brand *</Label>
                  <Select value={form.make} onValueChange={(v) => update('make', v)}>
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
                    value={form.model}
                    onChange={(e) => update('model', e.target.value)}
                    placeholder="e.g. Swift, Creta"
                    className={errors.model ? 'border-destructive' : ''}
                  />
                  {errors.model && <p className="text-destructive text-xs mt-1">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Year *</Label>
                  <Select value={form.year} onValueChange={(v) => update('year', v)}>
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
                  <Label className="text-sm font-medium mb-1.5 block">Mileage (km) *</Label>
                  <Input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => update('mileage', e.target.value)}
                    placeholder="e.g. 35000"
                    className={errors.mileage ? 'border-destructive' : ''}
                  />
                  {errors.mileage && <p className="text-destructive text-xs mt-1">{errors.mileage}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Fuel Type *</Label>
                  <Select value={form.fuelType} onValueChange={(v) => update('fuelType', v)}>
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
                  <Select value={form.transmission} onValueChange={(v) => update('transmission', v)}>
                    <SelectTrigger className={errors.transmission ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.transmission && <p className="text-destructive text-xs mt-1">{errors.transmission}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Color *</Label>
                  <Select value={form.color} onValueChange={(v) => update('color', v)}>
                    <SelectTrigger className={errors.color ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.color && <p className="text-destructive text-xs mt-1">{errors.color}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Registration Number *</Label>
                  <Input
                    value={form.registrationNumber}
                    onChange={(e) => update('registrationNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. DL8CAF1234"
                    className={errors.registrationNumber ? 'border-destructive' : ''}
                  />
                  {errors.registrationNumber && <p className="text-destructive text-xs mt-1">{errors.registrationNumber}</p>}
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold">
                Next: Contact & Price <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display font-semibold text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Contact & Pricing
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">City *</Label>
                  <Select value={form.city} onValueChange={(v) => update('city', v)}>
                    <SelectTrigger className={errors.city ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Asking Price (₹) *</Label>
                  <Input
                    type="number"
                    value={form.askingPrice}
                    onChange={(e) => update('askingPrice', e.target.value)}
                    placeholder="e.g. 450000"
                    className={errors.askingPrice ? 'border-destructive' : ''}
                  />
                  {errors.askingPrice && <p className="text-destructive text-xs mt-1">{errors.askingPrice}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Your Name *</Label>
                  <Input
                    value={form.sellerName}
                    onChange={(e) => update('sellerName', e.target.value)}
                    placeholder="Full name"
                    className={errors.sellerName ? 'border-destructive' : ''}
                  />
                  {errors.sellerName && <p className="text-destructive text-xs mt-1">{errors.sellerName}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Phone Number *</Label>
                  <Input
                    type="tel"
                    value={form.sellerPhone}
                    onChange={(e) => update('sellerPhone', e.target.value)}
                    placeholder="10-digit number"
                    maxLength={10}
                    className={errors.sellerPhone ? 'border-destructive' : ''}
                  />
                  {errors.sellerPhone && <p className="text-destructive text-xs mt-1">{errors.sellerPhone}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-1.5 block">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe your car's condition, features, service history..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1.5 block">Image URL (optional)</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => update('imageUrl', e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">Paste a direct link to your car's photo</p>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 text-sm">
                <p className="font-medium mb-2 text-muted-foreground">Listing Summary</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Car:</span>
                  <span className="font-medium">{form.year} {form.make} {form.model}</span>
                  <span className="text-muted-foreground">Fuel:</span>
                  <span className="font-medium">{form.fuelType} · {form.transmission}</span>
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="font-medium">{Number(form.mileage || 0).toLocaleString()} km</span>
                  <span className="text-muted-foreground">Reg. No:</span>
                  <span className="font-medium">{form.registrationNumber}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createListing.isPending}
                  className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  {createListing.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Listing ✓'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
