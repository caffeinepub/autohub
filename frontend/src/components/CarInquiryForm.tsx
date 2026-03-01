import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Loader2, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSubmitInquiry } from '../hooks/useQueries';

interface CarInquiryFormProps {
  listingId: string;
}

export default function CarInquiryForm({ listingId }: CarInquiryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inquiryMutation = useSubmitInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !message.trim()) return;

    try {
      await inquiryMutation.mutateAsync({
        listingId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit inquiry. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCustomerName('');
    setCustomerPhone('');
    setMessage('');
    inquiryMutation.reset();
  };

  return (
    <Card className="border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Ask About This Car</p>
                    <p className="text-xs text-muted-foreground">Send us your questions and we'll get back to you</p>
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
                  <p className="font-semibold text-green-700 mb-1">Inquiry Submitted!</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your inquiry has been submitted! Our team will get back to you shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="inq-name" className="text-sm font-medium">
                      Your Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="inq-name"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={inquiryMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inq-phone" className="text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="inq-phone"
                      type="tel"
                      placeholder="Enter your 10-digit mobile number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      disabled={inquiryMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inq-message" className="text-sm font-medium">
                      Your Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="inq-message"
                      placeholder="Ask about the car's condition, history, test drive availability, or any other questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      disabled={inquiryMutation.isPending}
                      className="resize-none"
                    />
                  </div>

                  {inquiryMutation.isError && (
                    <p className="text-xs text-destructive">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 font-semibold"
                    disabled={
                      inquiryMutation.isPending ||
                      !customerName.trim() ||
                      !customerPhone.trim() ||
                      !message.trim()
                    }
                  >
                    {inquiryMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Send Inquiry
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
