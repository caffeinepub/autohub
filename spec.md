# Specification

## Summary
**Goal:** Expand the pre-populated car listings in the backend to 50+ realistic second-hand car listings covering a wide variety of Indian makes, models, cities, fuel types, and transmissions.

**Planned changes:**
- Add at least 50 realistic fictional second-hand car listings to `backend/main.mo`
- Listings cover makes including Maruti Suzuki, Hyundai, Tata, Kia, Honda, Toyota, Mahindra, Renault, Skoda, Volkswagen, MG, Ford, Nissan, and Jeep
- Listings span popular models (Swift, Creta, Nexon, Seltos, City, Fortuner, Scorpio, Hector, etc.), years 2015–2023, and prices ₹2.0L–₹22L
- Listings include all fuel types (Petrol, Diesel, CNG, Electric) and both Manual and Automatic transmissions
- Listings cover 15+ Indian cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow, Chandigarh, Surat, Bhopal, Nagpur, Kochi)
- Each listing includes all required fields: id, make, model, year, mileage, fuelType, transmission, color, city, askingPrice, sellerName, sellerPhone, description, registrationNumber, postedAt, status (mix of 'available' and 'sold'), bookingStatus ('none'), imageUrls (≥1 URL), exteriorImages360 (≥8 URLs), and interiorImages360 (≥8 URLs)

**User-visible outcome:** After deployment, the Home page featured listings grid and the Listings browse page display 50+ diverse second-hand car listings from across India.
