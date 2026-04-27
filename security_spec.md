# HQ Travels Security Specification

## Data Invariants
1. A booking cannot exist without a valid user ID (unless guest checkout is allowed, but let's assume authenticated users or we create anonymous users if they book).
2. Users can only read their own bookings.
3. Admins can read and update all bookings.
4. Logo settings are readable by everyone but writable only by admins.

## The "Dirty Dozen" Payloads
1. `{"id": "test", "userId": "another-user"}` (Identity spoofing on create booking)
2. `{"id": "test", "userId": "my-id", "status": "CONFIRMED"}` (State shortcutting on create booking - must be PENDING)
3. `{"status": "CONFIRMED"}` (Unauthorized state change attempt by user)
4. Update to add a new `admin` field: `{"isAdmin": true}` in profile.
5. Large strings in `flightId`: `{"flightId": "a".repeat(1500)}` (Resource poisoning).
6. Providing invalid field type: `{"totalAmount": "100"}` instead of number.
...

## Test Runner
(We'll write a full `firestore.rules.test.ts` to test these)
