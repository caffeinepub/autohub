import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type CarListing = {
    id : Nat;
    make : Text;
    model : Text;
    year : Nat;
    mileage : Nat;
    fuelType : Text;
    transmission : Text;
    color : Text;
    city : Text;
    askingPrice : Nat;
    sellerName : Text;
    sellerPhone : Text;
    description : Text;
    imageUrls : [Text];
    exteriorImages360 : [Text];
    interiorImages360 : [Text];
    registrationNumber : Text;
    postedAt : Int;
    status : Text;
    bookingStatus : Text;
    bookedAt : ?Int;
    receiptFileName : ?Text;
  };

  type CallbackRequest = {
    id : Nat;
    listingId : Nat;
    customerName : Text;
    phone : Text;
    preferredTime : Text;
    requestedAt : Int;
  };

  type CarInquiry = {
    id : Text;
    listingId : Text;
    customerName : Text;
    customerPhone : Text;
    message : Text;
    submittedAt : Int;
  };

  type OldActor = {
    listings : Map.Map<Nat, CarListing>;
    callbackRequests : Map.Map<Nat, CallbackRequest>;
    inquiries : Map.Map<Text, CarInquiry>;
    nextId : Nat;
    nextCallbackId : Nat;
    sampleListings : [(Nat, CarListing)];
  };

  type NewActor = {
    listings : Map.Map<Nat, CarListing>;
    callbackRequests : Map.Map<Nat, CallbackRequest>;
    inquiries : Map.Map<Text, CarInquiry>;
    nextId : Nat;
    nextCallbackId : Nat;
    allListings : [CarListing];
  };

  public func run(old : OldActor) : NewActor {
    {
      listings = old.listings;
      callbackRequests = old.callbackRequests;
      inquiries = old.inquiries;
      nextId = old.nextId;
      nextCallbackId = old.nextCallbackId;
      allListings = old.sampleListings.map(func((_, listing)) { listing });
    };
  };
};
