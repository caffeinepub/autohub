import { toast } from 'sonner';
import { Building2, Landmark, ExternalLink, TrendingDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Lender {
  name: string;
  rateRange: string;
  tenure: string;
  highlight?: string;
}

const BANK_LENDERS: Lender[] = [
  { name: 'State Bank of India (SBI)', rateRange: '8.75% – 10.50%', tenure: 'Up to 7 years', highlight: 'Lowest Rate' },
  { name: 'HDFC Bank', rateRange: '9.00% – 11.00%', tenure: 'Up to 7 years', highlight: 'Fast Approval' },
  { name: 'Axis Bank', rateRange: '9.25% – 11.25%', tenure: 'Up to 7 years' },
  { name: 'ICICI Bank', rateRange: '9.00% – 11.50%', tenure: 'Up to 7 years' },
  { name: 'Bank of Baroda', rateRange: '8.90% – 10.75%', tenure: 'Up to 7 years' },
];

const NBFC_LENDERS: Lender[] = [
  { name: 'Bajaj Finserv', rateRange: '10.50% – 14.00%', tenure: 'Up to 5 years', highlight: 'Instant Approval' },
  { name: 'Mahindra Finance', rateRange: '11.00% – 15.00%', tenure: 'Up to 5 years', highlight: 'Rural Friendly' },
  { name: 'Shriram Finance', rateRange: '11.50% – 16.00%', tenure: 'Up to 5 years' },
  { name: 'Tata Capital', rateRange: '10.75% – 14.50%', tenure: 'Up to 5 years' },
  { name: 'Cholamandalam Finance', rateRange: '11.00% – 15.50%', tenure: 'Up to 5 years' },
];

function LenderCard({ lender }: { lender: Lender }) {
  const handleEnquire = () => {
    toast.success(`Enquiry sent to ${lender.name}`, {
      description: 'We will contact you shortly with loan details.',
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-secondary/40 hover:bg-secondary/70 border border-border rounded-xl transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground truncate">{lender.name}</span>
          {lender.highlight && (
            <Badge variant="outline" className="text-xs border-primary text-primary shrink-0">
              {lender.highlight}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingDown className="w-3 h-3 text-green-600" />
            <span className="text-green-700 font-medium">{lender.rateRange}</span>
          </span>
          <span className="text-xs text-muted-foreground">{lender.tenure}</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleEnquire}
        className="ml-3 shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs h-8 px-3"
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        Apply
      </Button>
    </div>
  );
}

export default function FinanceOptions() {
  return (
    <Card className="border-border">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Finance Options</h2>
          <Badge variant="secondary" className="text-xs ml-1">Indicative Rates</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Get pre-approved financing from leading banks and NBFCs. Click "Apply" to send an enquiry and our team will connect you with the lender.
        </p>

        <Tabs defaultValue="bank">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="bank" className="flex-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Finance
            </TabsTrigger>
            <TabsTrigger value="nbfc" className="flex-1 flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              NBFC Finance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank">
            <div className="space-y-2">
              {BANK_LENDERS.map((lender) => (
                <LenderCard key={lender.name} lender={lender} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Interest rates are indicative and subject to change. Final rates depend on credit profile and bank policies.
            </p>
          </TabsContent>

          <TabsContent value="nbfc">
            <div className="space-y-2">
              {NBFC_LENDERS.map((lender) => (
                <LenderCard key={lender.name} lender={lender} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * NBFCs may offer faster approvals with flexible eligibility. Rates are indicative and vary by profile.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
