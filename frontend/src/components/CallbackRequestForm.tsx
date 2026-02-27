import { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, Loader2, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateCallbackRequest } from '../hooks/useQueries';

interface CallbackRequestFormProps {
  listingId: bigint;
}

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning 9am – 12pm' },
  { value: 'afternoon', label: 'Afternoon 12pm – 4pm' },
  { value: 'evening', label: 'Evening 4pm – 8pm' },
];

export default function CallbackRequestForm({ listingId }: CallbackRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const callbackMutation = useCreateCallbackRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !preferredTime) return;

    try {
      await callbackMutation.mutateAsync({
        listingId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        preferredTime,
      });
      setSubmitted(true);
      toast.success('Callback request submitted!', {
        description: 'Thank you! Our team will call you back within 24 hours.',
      });
    } catch {
      toast.error('Failed to submit callback request. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCustomerName('');
    setPhone('');
    setPreferredTime('');
    callbackMutation.reset();
  };

  return (
    <Card className="border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Request a Callback</p>
                    <p className="text-xs text-muted-foreground">Our team will call you within 24 hours</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-5">
            <div className="border-t border-border pt-4">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-green-700 mb-1">Request Submitted!</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Thank you! Our team will call you back within 24 hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cb-name" className="text-sm font-medium">
                      Your Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cb-name"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={callbackMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cb-phone" className="text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cb-phone"
                      type="tel"
                      placeholder="Enter your 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={callbackMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Preferred Time Slot <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={preferredTime}
                      onValueChange={setPreferredTime}
                      disabled={callbackMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {callbackMutation.isError && (
                    <p className="text-xs text-destructive">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={
                      callbackMutation.isPending ||
                      !customerName.trim() ||
                      !phone.trim() ||
                      !preferredTime
                    }
                  >
                    {callbackMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Request Callback
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
