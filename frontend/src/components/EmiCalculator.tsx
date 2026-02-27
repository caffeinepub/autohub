import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calculator, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { calculateEMI, calculateTotalPayable, calculateTotalInterest, formatINR } from '../utils/emiCalculator';

interface EmiCalculatorProps {
  askingPrice: bigint;
}

const TENURE_OPTIONS = [12, 24, 36, 48, 60];

export default function EmiCalculator({ askingPrice }: EmiCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const carPrice = Number(askingPrice);

  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(36);

  const principal = Math.max(0, carPrice - downPayment);

  const emi = useMemo(
    () => calculateEMI(principal, interestRate, tenure),
    [principal, interestRate, tenure]
  );
  const totalPayable = useMemo(() => calculateTotalPayable(emi, tenure), [emi, tenure]);
  const totalInterest = useMemo(
    () => calculateTotalInterest(totalPayable, principal),
    [totalPayable, principal]
  );

  const downPaymentPercent = carPrice > 0 ? Math.round((downPayment / carPrice) * 100) : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Check EMI / Finance Options</p>
              <p className="text-xs text-muted-foreground">Calculate your monthly installment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOpen && emi > 0 && (
              <span className="text-sm font-bold text-primary hidden sm:block">
                ~{formatINR(emi)}/mo
              </span>
            )}
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-card border border-border border-t-0 rounded-b-xl p-5 space-y-5">
          {/* Car Price (read-only) */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
            <span className="text-sm text-muted-foreground">Car Price</span>
            <span className="font-bold text-foreground">{formatINR(carPrice)}</span>
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Down Payment</Label>
              <span className="text-sm font-semibold text-primary">
                {formatINR(downPayment)}{' '}
                <span className="text-xs text-muted-foreground font-normal">({downPaymentPercent}%)</span>
              </span>
            </div>
            <Slider
              min={0}
              max={carPrice}
              step={Math.max(1000, Math.round(carPrice / 100))}
              value={[downPayment]}
              onValueChange={([v]) => setDownPayment(v)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>{formatINR(carPrice)}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Annual Interest Rate</Label>
              <span className="text-sm font-semibold text-primary">{interestRate.toFixed(1)}%</span>
            </div>
            <Slider
              min={5}
              max={24}
              step={0.5}
              value={[interestRate]}
              onValueChange={([v]) => setInterestRate(v)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>24%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Loan Tenure</Label>
            <div className="flex gap-2 flex-wrap">
              {TENURE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    tenure === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {t} mo
                </button>
              ))}
            </div>
          </div>

          {/* Loan Amount */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
            <span className="text-sm text-muted-foreground">Loan Amount</span>
            <span className="font-bold text-foreground">{formatINR(principal)}</span>
          </div>

          {/* Results */}
          {principal > 0 && emi > 0 ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly EMI</span>
                <span className="text-2xl font-bold text-primary flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {emi.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-primary/10 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount Payable</p>
                  <p className="font-semibold text-sm">{formatINR(totalPayable)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Interest</p>
                  <p className="font-semibold text-sm text-amber-600">{formatINR(totalInterest)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                * Indicative EMI. Actual rates may vary by lender. Consult your bank or NBFC for exact terms.
              </p>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Adjust the down payment to calculate EMI
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
