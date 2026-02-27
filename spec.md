# Specification

## Summary
**Goal:** Fix the bug causing car listings to not appear on the Home page and Listings browse page.

**Planned changes:**
- Investigate and fix the backend `getAllListings` query so it correctly returns all stored car listings
- Verify and fix the frontend `useQueries.ts` hooks to ensure data is fetched and passed correctly to components
- Confirm CarCard and listings grid components render properly when data is available
- Ensure pre-populated sample listings are visible after the fix

**User-visible outcome:** Car listings appear correctly on both the Home page featured grid and the Listings browse page, with each card showing the car image, make, model, year, mileage, fuel type, and price.
