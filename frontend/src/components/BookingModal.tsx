import { useState, useRef } from 'react';
import {
  IndianRupee, Car, CheckCircle, Loader2, Calendar, MapPin,
  Upload, FileText, Building2, Copy, AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useSubmitReceipt } from '../hooks/useQueries';
import type { CarListing } from '../backend';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  listing: CarListing;
  onConfirm: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

const BANK_DETAILS = [
  { label: 'Account Number', value: '922010062230782' },
  { label: 'IFSC Code', value: 'UTIB0004620' },
  { label: 'Account Holder', value: 'KRISHNA KANT PANDEY' },
  { label: 'Bank', value: 'Axis Bank' },
];

export default function BookingModal({
  open,
  onClose,
  listing,
}: BookingModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitReceiptMutation = useSubmitReceipt();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      await submitReceiptMutation.mutateAsync({
        listingId: listing.id,
        receiptFileName: selectedFile.name,
      });
      setReceiptSuccess(true);
    } catch {
      toast.error('Failed to submit receipt. Please try again.');
    }
  };

  const handleClose = () => {
    if (submitReceiptMutation.isPending) return;
    setSelectedFile(null);
    setReceiptSuccess(false);
    submitReceiptMutation.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {receiptSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2 text-green-700">Booking Confirmed!</h2>
            <p className="text-muted-foreground text-sm mb-2">
              Your receipt for{' '}
              <span className="font-semibold text-foreground">
                {listing.year} {listing.make} {listing.model}
              </span>{' '}
              has been received.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Our team will verify and confirm within{' '}
              <span className="font-bold text-primary">2–4 hours</span>.
            </p>
            <Button onClick={handleClose} className="bg-primary text-primary-foreground w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Book This Car
              </DialogTitle>
              <DialogDescription>
                Transfer ₹5,000 to the account below and upload your payment receipt to confirm your booking.
              </DialogDescription>
            </DialogHeader>

            {/* Car Summary */}
            <div className="bg-secondary/50 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm">
                  {listing.year} {listing.make} {listing.model}
                </span>
                <span className="text-primary font-bold text-sm">{formatPrice(listing.askingPrice)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {listing.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {listing.year.toString()}
                </span>
              </div>
            </div>

            {/* Booking Amount */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Booking Amount</p>
                <p className="text-xs text-muted-foreground mt-0.5">Refundable token amount</p>
              </div>
              <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                <IndianRupee className="w-5 h-5" />
                5,000
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-primary/5 px-4 py-2.5 flex items-center gap-2 border-b border-border">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Bank Transfer Details</span>
              </div>
              <div className="p-3 space-y-2">
                {BANK_DETAILS.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold font-mono text-foreground">{value}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(value, label)}
                      className="shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      title={`Copy ${label}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Please transfer exactly <strong>₹5,000</strong> to the above account and upload the payment receipt below to confirm your booking.
              </p>
            </div>

            <Separator />

            {/* Receipt Upload */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Upload Payment Receipt
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, PDF (max 10MB)
              </p>

              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-primary truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload receipt
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {submitReceiptMutation.isError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Failed to submit. Please try again.
              </p>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={submitReceiptMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || submitReceiptMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitReceiptMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Booking with Receipt'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
