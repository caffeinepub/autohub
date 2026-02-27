import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { CarListing } from "@/backend";

// ── Listings ──────────────────────────────────────────────────────────────────

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<CarListing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAllListings();
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetListingById(id: string | undefined) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery<CarListing | null>({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const numId = BigInt(id);

      // First try the direct backend call
      try {
        const listing = await actor.getListingById(numId);
        return listing;
      } catch {
        // getListingById only searches the persistent Map, not sampleListings.
        // Fall back to searching the getAllListings cache (which includes sample data).
        const cached = queryClient.getQueryData<CarListing[]>(["listings"]);
        if (cached) {
          const found = cached.find((l) => l.id === numId);
          if (found) return found;
        }
        // If not in cache, fetch all listings and search
        const all = await actor.getAllListings();
        const found = all.find((l) => l.id === numId);
        return found ?? null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      make: string;
      model: string;
      year: bigint;
      mileage: bigint;
      fuelType: string;
      transmission: string;
      color: string;
      city: string;
      askingPrice: bigint;
      sellerName: string;
      sellerPhone: string;
      description: string;
      imageUrls: string[];
      exteriorImages360: string[];
      interiorImages360: string[];
      registrationNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createListing(
        params.make,
        params.model,
        params.year,
        params.mileage,
        params.fuelType,
        params.transmission,
        params.color,
        params.city,
        params.askingPrice,
        params.sellerName,
        params.sellerPhone,
        params.description,
        params.imageUrls,
        params.exteriorImages360,
        params.interiorImages360,
        params.registrationNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      make: string;
      model: string;
      year: bigint;
      mileage: bigint;
      fuelType: string;
      transmission: string;
      color: string;
      city: string;
      askingPrice: bigint;
      sellerName: string;
      sellerPhone: string;
      description: string;
      imageUrls: string[];
      exteriorImages360: string[];
      interiorImages360: string[];
      registrationNumber: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateListing(
        params.id,
        params.make,
        params.model,
        params.year,
        params.mileage,
        params.fuelType,
        params.transmission,
        params.color,
        params.city,
        params.askingPrice,
        params.sellerName,
        params.sellerPhone,
        params.description,
        params.imageUrls,
        params.exteriorImages360,
        params.interiorImages360,
        params.registrationNumber,
        params.status
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id.toString()] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useBookCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.bookCar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useSubmitReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { listingId: bigint; receiptFileName: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitReceipt(params.listingId, params.receiptFileName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

// ── Filter listings (client-side from getAllListings) ─────────────────────────

export interface FilterListingsParams {
  make?: string;
  minPrice?: bigint;
  maxPrice?: bigint;
  year?: bigint;
  fuelType?: string;
  city?: string;
}

export function useFilterListings(filters: FilterListingsParams) {
  const { actor, isFetching } = useActor();

  // Serialize bigint values to strings for the query key to avoid the
  // "BigInt detected in query key" lint error.
  const queryKeyFilters = {
    make: filters.make,
    minPrice: filters.minPrice?.toString(),
    maxPrice: filters.maxPrice?.toString(),
    year: filters.year?.toString(),
    fuelType: filters.fuelType,
    city: filters.city,
  };

  return useQuery<CarListing[]>({
    queryKey: ["listings", "filter", queryKeyFilters],
    queryFn: async () => {
      if (!actor) return [];
      // Use getAllListings (which includes sample data) and filter client-side
      // because filterCarListings backend only searches the persistent Map.
      const all = await actor.getAllListings();
      return all.filter((listing) => {
        if (filters.make && listing.make !== filters.make) return false;
        if (filters.minPrice !== undefined && listing.askingPrice < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && listing.askingPrice > filters.maxPrice) return false;
        if (filters.year !== undefined && listing.year !== filters.year) return false;
        if (filters.fuelType && listing.fuelType !== filters.fuelType) return false;
        if (filters.city && filters.city !== "All India" && listing.city !== filters.city) return false;
        return true;
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Callback Requests ─────────────────────────────────────────────────────────

export function useAddCallbackRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      listingId: bigint;
      customerName: string;
      phone: string;
      preferredTime: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addCallbackRequest(
        params.listingId,
        params.customerName,
        params.phone,
        params.preferredTime
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callbackRequests"] });
    },
  });
}

// Keep the old name as an alias so existing callers (CallbackRequestForm) still work
export const useCreateCallbackRequest = useAddCallbackRequest;

export function useGetAllCallbackRequests() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["callbackRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCallbackRequests();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
  });
}

export function useGetCallbackRequestsByListingId(listingId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["callbackRequests", listingId?.toString()],
    queryFn: async () => {
      if (!actor || listingId === undefined) return [];
      return actor.getCallbackRequestsByListingId(listingId);
    },
    enabled: !!actor && !isFetching && listingId !== undefined,
  });
}

// ── Booking Records ───────────────────────────────────────────────────────────

export function useGetAllBookingRecords() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["bookingRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookingRecords();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
  });
}

// ── Bank Details ──────────────────────────────────────────────────────────────

export function useGetBankDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ["bankDetails"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getBankDetails();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Vehicle Lookup ────────────────────────────────────────────────────────────

export function useGetListingByRegistrationNumber(registrationNumber: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<CarListing | null>({
    queryKey: ["listing", "reg", registrationNumber],
    queryFn: async () => {
      if (!actor || !registrationNumber) return null;
      return actor.getListingByRegistrationNumber(registrationNumber);
    },
    enabled: !!actor && !isFetching && !!registrationNumber,
  });
}
