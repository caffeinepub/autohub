import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  var nextId = 51;
  var nextCallbackId = 1;
  var listings = Map.empty<Nat, CarListing>();
  var callbackRequests = Map.empty<Nat, CallbackRequest>();
  var inquiries = Map.empty<Text, CarInquiry>();
  var allListings : [CarListing] = [];

  public shared ({ caller }) func createListing(
    make : Text,
    model : Text,
    year : Nat,
    mileage : Nat,
    fuelType : Text,
    transmission : Text,
    color : Text,
    city : Text,
    askingPrice : Nat,
    sellerName : Text,
    sellerPhone : Text,
    description : Text,
    imageUrls : [Text],
    exteriorImages360 : [Text],
    interiorImages360 : [Text],
    registrationNumber : Text,
  ) : async Nat {
    let newListing : CarListing = {
      id = nextId;
      make;
      model;
      year;
      mileage;
      fuelType;
      transmission;
      color;
      city;
      askingPrice;
      sellerName;
      sellerPhone;
      description;
      imageUrls;
      exteriorImages360;
      interiorImages360;
      registrationNumber;
      postedAt = Time.now();
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    };
    listings.add(nextId, newListing);
    nextId += 1;
    newListing.id;
  };

  public query ({ caller }) func getAllListings() : async [CarListing] {
    let persistentListings = listings.values().toArray();
    persistentListings.concat(allListings);
  };

  public query ({ caller }) func getListingById(id : Nat) : async CarListing {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public query ({ caller }) func getListingByRegistrationNumber(registrationNumber : Text) : async ?CarListing {
    listings.values().find(
      func(listing) {
        listing.registrationNumber == registrationNumber;
      }
    );
  };

  public shared ({ caller }) func updateListing(
    id : Nat,
    make : Text,
    model : Text,
    year : Nat,
    mileage : Nat,
    fuelType : Text,
    transmission : Text,
    color : Text,
    city : Text,
    askingPrice : Nat,
    sellerName : Text,
    sellerPhone : Text,
    description : Text,
    imageUrls : [Text],
    exteriorImages360 : [Text],
    interiorImages360 : [Text],
    registrationNumber : Text,
    status : Text,
  ) : async () {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?oldListing) {
        let updatedListing : CarListing = {
          id;
          make;
          model;
          year;
          mileage;
          fuelType;
          transmission;
          color;
          city;
          askingPrice;
          sellerName;
          sellerPhone;
          description;
          imageUrls;
          exteriorImages360;
          interiorImages360;
          registrationNumber;
          postedAt = Time.now();
          status;
          bookingStatus = oldListing.bookingStatus;
          bookedAt = oldListing.bookedAt;
          receiptFileName = oldListing.receiptFileName;
        };
        listings.add(id, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    if (not listings.containsKey(id)) {
      Runtime.trap("Listing not found");
    };
    listings.remove(id);
  };

  public query ({ caller }) func filterCarListings(
    make : ?Text,
    minPrice : ?Nat,
    maxPrice : ?Nat,
    year : ?Nat,
    fuelType : ?Text,
    city : ?Text,
  ) : async [CarListing] {
    allListings.filter(
      func(listing) {
        var matches = true;
        if (matches) {
          switch (make) {
            case (null) {};
            case (?m) { matches := matches and (listing.make == m) };
          };
        };
        if (matches) {
          switch (minPrice) {
            case (null) {};
            case (?minP) { matches := matches and (listing.askingPrice >= minP) };
          };
        };
        if (matches) {
          switch (maxPrice) {
            case (null) {};
            case (?maxP) { matches := matches and (listing.askingPrice <= maxP) };
          };
        };
        if (matches) {
          switch (year) {
            case (null) {};
            case (?y) { matches := matches and (listing.year == y) };
          };
        };
        if (matches) {
          switch (fuelType) {
            case (null) {};
            case (?ft) { matches := matches and (listing.fuelType == ft) };
          };
        };
        if (matches) {
          switch (city) {
            case (null) {};
            case (?c) { matches := matches and (listing.city == c) };
          };
        };
        matches;
      }
    );
  };

  public shared ({ caller }) func updateListingImages(
    id : Nat,
    imageUrls : [Text],
    exteriorImages360 : [Text],
    interiorImages360 : [Text],
  ) : async () {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing : CarListing = {
          id = listing.id;
          make = listing.make;
          model = listing.model;
          year = listing.year;
          mileage = listing.mileage;
          fuelType = listing.fuelType;
          transmission = listing.transmission;
          color = listing.color;
          city = listing.city;
          askingPrice = listing.askingPrice;
          sellerName = listing.sellerName;
          sellerPhone = listing.sellerPhone;
          description = listing.description;
          imageUrls;
          exteriorImages360;
          interiorImages360;
          registrationNumber = listing.registrationNumber;
          postedAt = listing.postedAt;
          status = listing.status;
          bookingStatus = listing.bookingStatus;
          bookedAt = listing.bookedAt;
          receiptFileName = listing.receiptFileName;
        };
        listings.add(id, updatedListing);
      };
    };
  };

  public shared ({ caller }) func bookCar(id : Nat) : async () {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.status != "available") {
          Runtime.trap("Car is not available for booking");
        };
        let updatedListing : CarListing = {
          id = listing.id;
          make = listing.make;
          model = listing.model;
          year = listing.year;
          mileage = listing.mileage;
          fuelType = listing.fuelType;
          transmission = listing.transmission;
          color = listing.color;
          city = listing.city;
          askingPrice = listing.askingPrice;
          sellerName = listing.sellerName;
          sellerPhone = listing.sellerPhone;
          description = listing.description;
          imageUrls = listing.imageUrls;
          exteriorImages360 = listing.exteriorImages360;
          interiorImages360 = listing.interiorImages360;
          registrationNumber = listing.registrationNumber;
          postedAt = listing.postedAt;
          status = "booked";
          bookingStatus = "booked";
          bookedAt = ?Time.now();
          receiptFileName = null;
        };
        listings.add(id, updatedListing);
      };
    };
  };

  public shared ({ caller }) func addCallbackRequest(
    listingId : Nat,
    customerName : Text,
    phone : Text,
    preferredTime : Text,
  ) : async Nat {
    let newRequest : CallbackRequest = {
      id = nextCallbackId;
      listingId;
      customerName;
      phone;
      preferredTime;
      requestedAt = Time.now();
    };
    callbackRequests.add(nextCallbackId, newRequest);
    nextCallbackId += 1;
    newRequest.id;
  };

  public query ({ caller }) func getAllCallbackRequests() : async [CallbackRequest] {
    callbackRequests.values().toArray();
  };

  public query ({ caller }) func getCallbackRequestsByListingId(listingId : Nat) : async [CallbackRequest] {
    callbackRequests.values().toArray().filter(
      func(req) { req.listingId == listingId }
    );
  };

  public shared ({ caller }) func submitReceipt(listingId : Nat, receiptFileName : Text) : async () {
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = {
          id = listing.id;
          make = listing.make;
          model = listing.model;
          year = listing.year;
          mileage = listing.mileage;
          fuelType = listing.fuelType;
          transmission = listing.transmission;
          color = listing.color;
          city = listing.city;
          askingPrice = listing.askingPrice;
          sellerName = listing.sellerName;
          sellerPhone = listing.sellerPhone;
          description = listing.description;
          imageUrls = listing.imageUrls;
          exteriorImages360 = listing.exteriorImages360;
          interiorImages360 = listing.interiorImages360;
          registrationNumber = listing.registrationNumber;
          postedAt = listing.postedAt;
          status = listing.status;
          bookingStatus = listing.bookingStatus;
          bookedAt = listing.bookedAt;
          receiptFileName = ?receiptFileName;
        };
        listings.add(listingId, updatedListing);
      };
    };
  };

  public query ({ caller }) func getBankDetails() : async Text {
    "Account Number: 922010062230782\nIFSC Code: UTIB0004620\nAccount Holder: KRISHNA KANT PANDEY\nBank: Axis Bank";
  };

  public query ({ caller }) func getAllBookingRecords() : async [CarListing] {
    allListings.filter(
      func(listing) {
        listing.bookingStatus == "booked";
      }
    );
  };

  public shared ({ caller }) func submitInquiry(
    listingId : Text,
    customerName : Text,
    customerPhone : Text,
    message : Text,
  ) : async Text {
    let inquiryId = customerPhone;

    let newInquiry : CarInquiry = {
      id = inquiryId;
      listingId;
      customerName;
      customerPhone;
      message;
      submittedAt = Time.now();
    };

    inquiries.add(inquiryId, newInquiry);
    inquiryId;
  };

  public query ({ caller }) func getInquiriesByListing(listingId : Text) : async [CarInquiry] {
    let result = inquiries.entries().toArray().filter(
      func((_, inquiry)) {
        inquiry.listingId == listingId;
      }
    ).map(
      func((_, inquiry)) { inquiry }
    );
    result;
  };

  public query ({ caller }) func getAllInquiries() : async [CarInquiry] {
    inquiries.values().toArray();
  };
};
