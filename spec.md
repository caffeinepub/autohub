# Specification

## Summary
**Goal:** Add an admin dashboard to AutoHub where staff can view all callback requests, paid bookings, and car listing inquiries in one place.

**Planned changes:**
- Add backend queries to fetch all `CallbackRequest` records and all `CarListing` records with `bookingStatus = 'booked'`, using existing data models
- Create a new `/admin` page with three tabbed sections:
  - **Callback Requests** — table with customer name, full (unmasked) phone number, listing ID, preferred time slot, and submission date
  - **Bookings & Payments** — table of booked listings with car details, registration number, seller name, receipt file name, and booked-at timestamp
  - **All Listings / Purchase Inquiries** — table of all listings with ID, make, model, year, city, asking price, status, and posted date
- Each tab shows a total record count and is sorted newest first by default
- Dashboard is styled with the AutoHub red-orange and dark-grey theme
- Add an "Admin" navigation link in both the desktop navbar (far right) and mobile hamburger menu, pointing to `/admin`, styled as a secondary nav item

**User-visible outcome:** Staff can navigate to `/admin` to review all customer callback requests, completed bookings with payment receipts, and the full car listings inventory in a clean tabbed dashboard.
