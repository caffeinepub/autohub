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

  type OldActor = {
    var nextId : Nat;
    var nextCallbackId : Nat;
    var listings : Map.Map<Nat, CarListing>;
    var callbackRequests : Map.Map<Nat, CallbackRequest>;
  };

  type NewActor = {
    var nextId : Nat;
    var nextCallbackId : Nat;
    var listings : Map.Map<Nat, CarListing>;
    var callbackRequests : Map.Map<Nat, CallbackRequest>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
