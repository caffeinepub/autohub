import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CarListing, CallbackRequest } from '../backend';

export function useGetAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery<CarListing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListingById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<CarListing | null>({
    queryKey: ['listing', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getListingById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetListingByRegistrationNumber(regNumber: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<CarListing | null>({
    queryKey: ['listing-reg', regNumber],
    queryFn: async () => {
      if (!actor || !regNumber) return null;
      return actor.getListingByRegistrationNumber(regNumber);
    },
    enabled: !!actor && !isFetching && !!regNumber,
  });
}

export interface FilterParams {
  make: string | null;
  minPrice: bigint | null;
  maxPrice: bigint | null;
  year: bigint | null;
  fuelType: string | null;
  city: string | null;
}

export function useFilterListings(params: FilterParams, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<CarListing[]>({
    queryKey: ['listings-filtered', JSON.stringify(params)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterCarListings(
        params.make,
        params.minPrice,
        params.maxPrice,
        params.year,
        params.fuelType,
        params.city
      );
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
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
      if (!actor) throw new Error('Actor not initialized');
      return actor.createListing(
        data.make,
        data.model,
        data.year,
        data.mileage,
        data.fuelType,
        data.transmission,
        data.color,
        data.city,
        data.askingPrice,
        data.sellerName,
        data.sellerPhone,
        data.description,
        data.imageUrls,
        data.exteriorImages360,
        data.interiorImages360,
        data.registrationNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useBookCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.bookCar(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['listing', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useCreateCallbackRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      listingId: bigint;
      customerName: string;
      phone: string;
      preferredTime: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCallbackRequest(
        data.listingId,
        data.customerName,
        data.phone,
        data.preferredTime
      );
    },
  });
}

export function useSubmitReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { listingId: bigint; receiptFileName: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitReceipt(data.listingId, data.receiptFileName);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useGetAllCallbackRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<CallbackRequest[]>({
    queryKey: ['callback-requests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCallbackRequests();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
  });
}

export function useGetAllBookingRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<CarListing[]>({
    queryKey: ['booking-records'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookingRecords();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
  });
}
