export interface ResaleInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  city: string;
}

export interface ResaleFactor {
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  adjustment: number; // percentage
}

export interface ResaleResult {
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  factors: ResaleFactor[];
}

// Base prices in INR for popular models (2023 reference)
const BASE_PRICES: Record<string, Record<string, number>> = {
  Maruti: {
    Swift: 700000,
    WagonR: 600000,
    Baleno: 750000,
    Dzire: 680000,
    Vitara: 1100000,
    Ertiga: 900000,
    Brezza: 1000000,
    Alto: 450000,
    Celerio: 550000,
    default: 600000,
  },
  Hyundai: {
    i20: 850000,
    Creta: 1200000,
    Venue: 1000000,
    Verna: 1100000,
    'Grand i10': 700000,
    Tucson: 2800000,
    Alcazar: 1800000,
    default: 900000,
  },
  Honda: {
    City: 1100000,
    Amaze: 800000,
    Jazz: 850000,
    WRV: 1000000,
    'CR-V': 2800000,
    default: 900000,
  },
  Tata: {
    Nexon: 1000000,
    Altroz: 800000,
    Harrier: 1600000,
    Safari: 1800000,
    Tiago: 600000,
    Tigor: 700000,
    default: 850000,
  },
  Mahindra: {
    Thar: 1400000,
    XUV700: 2000000,
    Scorpio: 1500000,
    Bolero: 1000000,
    XUV300: 1100000,
    default: 1200000,
  },
  Toyota: {
    Innova: 1800000,
    Fortuner: 3500000,
    Glanza: 800000,
    'Urban Cruiser': 1100000,
    Camry: 4500000,
    default: 1500000,
  },
  Kia: {
    Seltos: 1400000,
    Sonet: 1000000,
    Carnival: 3000000,
    default: 1200000,
  },
  Volkswagen: {
    Polo: 900000,
    Vento: 1100000,
    Taigun: 1400000,
    default: 1100000,
  },
  default: { default: 800000 },
};

function getBasePrice(make: string, model: string): number {
  const makeData = BASE_PRICES[make] || BASE_PRICES['default'];
  return makeData[model] || makeData['default'] || 800000;
}

export function calculateResaleValue(input: ResaleInput): ResaleResult {
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  const basePrice = getBasePrice(input.make, input.model);
  const factors: ResaleFactor[] = [];

  // Age depreciation: ~15% first year, ~10% subsequent years
  let ageDepreciation = 0;
  if (age <= 0) {
    ageDepreciation = 0;
  } else if (age === 1) {
    ageDepreciation = 15;
  } else if (age <= 3) {
    ageDepreciation = 15 + (age - 1) * 10;
  } else if (age <= 5) {
    ageDepreciation = 35 + (age - 3) * 8;
  } else if (age <= 8) {
    ageDepreciation = 51 + (age - 5) * 6;
  } else {
    ageDepreciation = Math.min(69 + (age - 8) * 4, 85);
  }

  factors.push({
    label: 'Vehicle Age',
    impact: age <= 2 ? 'positive' : age <= 5 ? 'neutral' : 'negative',
    description: `${age} year${age !== 1 ? 's' : ''} old — ${age <= 2 ? 'relatively new' : age <= 5 ? 'moderate depreciation' : 'significant depreciation'}`,
    adjustment: -ageDepreciation,
  });

  // Mileage depreciation
  const avgAnnualMileage = 15000;
  const expectedMileage = age * avgAnnualMileage;
  let mileageAdj = 0;
  if (input.mileage < expectedMileage * 0.7) {
    mileageAdj = 5;
    factors.push({
      label: 'Mileage',
      impact: 'positive',
      description: `${input.mileage.toLocaleString()} km — below average, adds value`,
      adjustment: mileageAdj,
    });
  } else if (input.mileage > expectedMileage * 1.3) {
    mileageAdj = -8;
    factors.push({
      label: 'Mileage',
      impact: 'negative',
      description: `${input.mileage.toLocaleString()} km — above average, reduces value`,
      adjustment: mileageAdj,
    });
  } else {
    factors.push({
      label: 'Mileage',
      impact: 'neutral',
      description: `${input.mileage.toLocaleString()} km — average for age`,
      adjustment: 0,
    });
  }

  // Fuel type adjustment
  let fuelAdj = 0;
  if (input.fuelType === 'Diesel') {
    fuelAdj = 3;
    factors.push({ label: 'Fuel Type', impact: 'positive', description: 'Diesel — higher resale demand', adjustment: fuelAdj });
  } else if (input.fuelType === 'Electric') {
    fuelAdj = 8;
    factors.push({ label: 'Fuel Type', impact: 'positive', description: 'Electric — premium resale value', adjustment: fuelAdj });
  } else if (input.fuelType === 'CNG') {
    fuelAdj = -2;
    factors.push({ label: 'Fuel Type', impact: 'neutral', description: 'CNG — slightly lower resale', adjustment: fuelAdj });
  } else {
    factors.push({ label: 'Fuel Type', impact: 'neutral', description: 'Petrol — standard resale value', adjustment: 0 });
  }

  // Transmission adjustment
  let transAdj = 0;
  if (input.transmission === 'Automatic') {
    transAdj = 4;
    factors.push({ label: 'Transmission', impact: 'positive', description: 'Automatic — higher demand in cities', adjustment: transAdj });
  } else {
    factors.push({ label: 'Transmission', impact: 'neutral', description: 'Manual — standard market value', adjustment: 0 });
  }

  // City adjustment
  let cityAdj = 0;
  const premiumCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
  if (premiumCities.includes(input.city)) {
    cityAdj = 3;
    factors.push({ label: 'Location', impact: 'positive', description: `${input.city} — metro city, higher demand`, adjustment: cityAdj });
  } else {
    factors.push({ label: 'Location', impact: 'neutral', description: `${input.city} — standard market`, adjustment: 0 });
  }

  const totalAdjustment = -ageDepreciation + mileageAdj + fuelAdj + transAdj + cityAdj;
  const estimatedPrice = basePrice * (1 + totalAdjustment / 100);
  const variance = estimatedPrice * 0.08;

  return {
    minPrice: Math.round((estimatedPrice - variance) / 1000) * 1000,
    maxPrice: Math.round((estimatedPrice + variance) / 1000) * 1000,
    basePrice,
    factors,
  };
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}
