/**
 * Calculates monthly EMI using the standard formula:
 * EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]
 * where:
 *   P = principal (loan amount = asking price - down payment)
 *   r = monthly interest rate (annual rate / 12 / 100)
 *   n = tenure in months
 */
export function calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent === 0) return principal / tenureMonths;

  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

export function calculateTotalPayable(emi: number, tenureMonths: number): number {
  return emi * tenureMonths;
}

export function calculateTotalInterest(totalPayable: number, principal: number): number {
  return Math.max(0, totalPayable - principal);
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
