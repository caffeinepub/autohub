import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CarListing {
    id: bigint;
    status: string;
    interiorImages360: Array<string>;
    model: string;
    postedAt: bigint;
    mileage: bigint;
    bookedAt?: bigint;
    imageUrls: Array<string>;
    sellerPhone: string;
    askingPrice: bigint;
    city: string;
    make: string;
    color: string;
    year: bigint;
    description: string;
    registrationNumber: string;
    sellerName: string;
    bookingStatus: string;
    transmission: string;
    fuelType: string;
    exteriorImages360: Array<string>;
    receiptFileName?: string;
}
export interface CarInquiry {
    id: string;
    customerName: string;
    customerPhone: string;
    listingId: string;
    submittedAt: bigint;
    message: string;
}
export interface CallbackRequest {
    id: bigint;
    customerName: string;
    listingId: bigint;
    preferredTime: string;
    phone: string;
    requestedAt: bigint;
}
export interface backendInterface {
    addCallbackRequest(listingId: bigint, customerName: string, phone: string, preferredTime: string): Promise<bigint>;
    bookCar(id: bigint): Promise<void>;
    createListing(make: string, model: string, year: bigint, mileage: bigint, fuelType: string, transmission: string, color: string, city: string, askingPrice: bigint, sellerName: string, sellerPhone: string, description: string, imageUrls: Array<string>, exteriorImages360: Array<string>, interiorImages360: Array<string>, registrationNumber: string): Promise<bigint>;
    deleteListing(id: bigint): Promise<void>;
    filterCarListings(make: string | null, minPrice: bigint | null, maxPrice: bigint | null, year: bigint | null, fuelType: string | null, city: string | null): Promise<Array<CarListing>>;
    getAllBookingRecords(): Promise<Array<CarListing>>;
    getAllCallbackRequests(): Promise<Array<CallbackRequest>>;
    getAllInquiries(): Promise<Array<CarInquiry>>;
    getAllListings(): Promise<Array<CarListing>>;
    getBankDetails(): Promise<string>;
    getCallbackRequestsByListingId(listingId: bigint): Promise<Array<CallbackRequest>>;
    getInquiriesByListing(listingId: string): Promise<Array<CarInquiry>>;
    getListingById(id: bigint): Promise<CarListing>;
    getListingByRegistrationNumber(registrationNumber: string): Promise<CarListing | null>;
    submitInquiry(listingId: string, customerName: string, customerPhone: string, message: string): Promise<string>;
    submitReceipt(listingId: bigint, receiptFileName: string): Promise<void>;
    updateListing(id: bigint, make: string, model: string, year: bigint, mileage: bigint, fuelType: string, transmission: string, color: string, city: string, askingPrice: bigint, sellerName: string, sellerPhone: string, description: string, imageUrls: Array<string>, exteriorImages360: Array<string>, interiorImages360: Array<string>, registrationNumber: string, status: string): Promise<void>;
    updateListingImages(id: bigint, imageUrls: Array<string>, exteriorImages360: Array<string>, interiorImages360: Array<string>): Promise<void>;
}
