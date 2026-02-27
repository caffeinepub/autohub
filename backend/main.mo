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

  var nextId = 26;
  var nextCallbackId = 1;
  var listings = Map.empty<Nat, CarListing>();
  var callbackRequests = Map.empty<Nat, CallbackRequest>();

  let sampleListings : [(Nat, CarListing)] = [
    (1, {
      id = 1;
      make = "Toyota";
      model = "Corolla";
      year = 2018;
      mileage = 35000;
      fuelType = "Petrol";
      transmission = "Automatic";
      color = "White";
      city = "Delhi";
      askingPrice = 850000;
      sellerName = "Rajesh Kumar";
      sellerPhone = "9876543210";
      description = "Well maintained Toyota Corolla with low mileage. Single owner, no accidents.";
      imageUrls = [
        "/images/listings/toyota_corolla_2018/img1.jpg",
        "/images/listings/toyota_corolla_2018/img2.jpg",
        "/images/listings/toyota_corolla_2018/img3.jpg",
        "/images/listings/toyota_corolla_2018/img4.jpg",
        "/images/listings/toyota_corolla_2018/img5.jpg",
      ];
      exteriorImages360 = [
        "/images/listings/toyota_corolla_2018/exterior360/img1.jpg",
        "/images/listings/toyota_corolla_2018/exterior360/img2.jpg",
        "/images/listings/toyota_corolla_2018/exterior360/img3.jpg",
      ];
      interiorImages360 = [
        "/images/listings/toyota_corolla_2018/interior360/img1.jpg",
        "/images/listings/toyota_corolla_2018/interior360/img2.jpg",
        "/images/listings/toyota_corolla_2018/interior360/img3.jpg",
      ];
      registrationNumber = "DL12AB1234";
      postedAt = 1717277400000000000;
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    }),
    (2, {
      id = 2;
      make = "Honda";
      model = "City";
      year = 2020;
      mileage = 18000;
      fuelType = "Petrol";
      transmission = "Manual";
      color = "Blue";
      city = "Mumbai";
      askingPrice = 1100000;
      sellerName = "Priya Sharma";
      sellerPhone = "9898989898";
      description = "Excellent condition Honda City, less driven, latest model.";
      imageUrls = [
        "/images/listings/honda_city_2020/img1.jpg",
        "/images/listings/honda_city_2020/img2.jpg",
        "/images/listings/honda_city_2020/img3.jpg",
        "/images/listings/honda_city_2020/img4.jpg",
        "/images/listings/honda_city_2020/img5.jpg",
      ];
      exteriorImages360 = [
        "/images/listings/honda_city_2020/exterior360/img1.jpg",
        "/images/listings/honda_city_2020/exterior360/img2.jpg",
      ];
      interiorImages360 = [
        "/images/listings/honda_city_2020/interior360/img1.jpg",
        "/images/listings/honda_city_2020/interior360/img2.jpg",
      ];
      registrationNumber = "MH01CD5678";
      postedAt = 1717277400000000000;
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    }),
    (3, {
      id = 3;
      make = "Maruti Suzuki";
      model = "Swift";
      year = 2019;
      mileage = 22000;
      fuelType = "Diesel";
      transmission = "Manual";
      color = "Red";
      city = "Bangalore";
      askingPrice = 650000;
      sellerName = "Neha Singh";
      sellerPhone = "9009009000";
      description = "Maruti Suzuki Swift in excellent condition, low mileage, great fuel efficiency.";
      imageUrls = [
        "/images/listings/maruti_swift_2019/img1.jpg",
        "/images/listings/maruti_swift_2019/img2.jpg",
        "/images/listings/maruti_swift_2019/img3.jpg",
        "/images/listings/maruti_swift_2019/img4.jpg",
        "/images/listings/maruti_swift_2019/img5.jpg",
      ];
      exteriorImages360 = [
        "/images/listings/maruti_swift_2019/exterior360/img1.jpg"
      ];
      interiorImages360 = [
        "/images/listings/maruti_swift_2019/interior360/img1.jpg"
      ];
      registrationNumber = "KA05FG4321";
      postedAt = 1717277400000000000;
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    }),
    (4, {
      id = 4;
      make = "Hyundai";
      model = "Creta";
      year = 2021;
      mileage = 8000;
      fuelType = "Petrol";
      transmission = "Automatic";
      color = "Black";
      city = "Chennai";
      askingPrice = 1700000;
      sellerName = "Vikram Reddy";
      sellerPhone = "9988776655";
      description = "Hyundai Creta, barely used, top-end variant, fully loaded.";
      imageUrls = [
        "/images/listings/hyundai_creta_2021/img1.jpg",
        "/images/listings/hyundai_creta_2021/img2.jpg",
        "/images/listings/hyundai_creta_2021/img3.jpg",
        "/images/listings/hyundai_creta_2021/img4.jpg",
        "/images/listings/hyundai_creta_2021/img5.jpg",
      ];
      exteriorImages360 = [
        "/images/listings/hyundai_creta_2021/exterior360/img1.jpg"
      ];
      interiorImages360 = [
        "/images/listings/hyundai_creta_2021/interior360/img1.jpg"
      ];
      registrationNumber = "TN09GH1234";
      postedAt = 1717277400000000000;
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    }),
    (5, {
      id = 5;
      make = "Ford";
      model = "EcoSport";
      year = 2017;
      mileage = 40000;
      fuelType = "Diesel";
      transmission = "Manual";
      color = "Silver";
      city = "Pune";
      askingPrice = 700000;
      sellerName = "Ankit Jain";
      sellerPhone = "9123456789";
      description = "Ford EcoSport, good condition, well maintained, family car.";
      imageUrls = [
        "/images/listings/ford_ecosport_2017/img1.jpg",
        "/images/listings/ford_ecosport_2017/img2.jpg",
        "/images/listings/ford_ecosport_2017/img3.jpg",
        "/images/listings/ford_ecosport_2017/img4.jpg",
      ];
      exteriorImages360 = [
        "/images/listings/ford_ecosport_2017/exterior360/img1.jpg"
      ];
      interiorImages360 = [
        "/images/listings/ford_ecosport_2017/interior360/img1.jpg"
      ];
      registrationNumber = "MH12JK5678";
      postedAt = 1717277400000000000;
      status = "available";
      bookingStatus = "none";
      bookedAt = null;
      receiptFileName = null;
    }),
  ];

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
    let sampleListingsList = sampleListings.map(func((_, listing)) { listing });
    persistentListings.concat(sampleListingsList);
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
    listings.values().toArray().filter(
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
    listings.values().toArray().filter(
      func(listing) {
        listing.bookingStatus == "booked";
      }
    );
  };
};
