# Highway-help API (Express + MongoDB)

A real, runnable backend for Highway-help — Node.js, Express, Mongoose
(MongoDB), JWT auth for three roles (customer / mechanic / admin), and
Socket.IO for live booking updates.

This mirrors the field names and booking lifecycle the frontend's mock
`BookingContext`/`AuthContext` already use, so wiring the two together later
is a matter of swapping `localStorage` calls for `axios` calls — not a
redesign.

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local: `mongodb://127.0.0.1:27017/highway-help` (install MongoDB Community
    Server and run `mongod`), or
  - Free cloud: a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
    (a free M0 tier is enough for this project)

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login (not stored in the DB,
  checked against these env vars)
- `CLIENT_URL` — the frontend's dev URL (default `http://localhost:5173`)

## 3. Seed demo data

```bash
npm run seed
```

This wipes and repopulates:

- All 75 UP districts + their highways/expressways
- 6 services (Bike Repair, Car Repair, Battery, Puncture, Tyre, Towing)
- 8 demo mechanics spread across Gorakhpur, Lucknow, Varanasi, Agra, Kanpur
  Nagar, Prayagraj — same ones as the frontend mock
- 3 demo customers
- 4 petrol pumps (Gorakhpur)
- 3 demo complaints

**Demo password for every seeded customer and mechanic:** `password123`
(login with their email/phone from the mock data, e.g. `aditya@example.com`
or `+91 98765 43210`).

## 4. Run

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

---

## API Reference

All protected routes expect `Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Method | Route                | Auth | Body                                                                        |
| ------ | -------------------- | ---- | --------------------------------------------------------------------------- |
| POST   | `/customer/register` | —    | `name, email, phone, vehicle?, password`                                    |
| POST   | `/customer/login`    | —    | `email, password`                                                           |
| POST   | `/mechanic/register` | —    | `name, phone, workshop?, services[], vehicleTypes[], districtId?, password` |
| POST   | `/mechanic/login`    | —    | `phone, password`                                                           |
| POST   | `/admin/login`       | —    | `email, password` (checked against env vars)                                |
| GET    | `/me`                | any  | —                                                                           |

### Mechanics (`/api/mechanics`)

| Method | Route                                                               | Auth     | Notes                                                                                               |
| ------ | ------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| GET    | `/?service=&vehicleType=&districtId=&highway=&available=&lat=&lng=` | —        | Public list, filterable. Pass `lat`/`lng` to get real haversine `distanceKm`, sorted nearest-first. |
| GET    | `/:id`                                                              | —        | Mechanic details                                                                                    |
| GET    | `/me/profile`                                                       | mechanic | Own profile                                                                                         |
| PATCH  | `/me/availability`                                                  | mechanic | `{ available: boolean }`                                                                            |
| PATCH  | `/me/location`                                                      | mechanic | `{ lat, lng }`                                                                                      |

### Bookings (`/api/bookings`)

| Method | Route             | Auth           | Notes                                                                            |
| ------ | ----------------- | -------------- | -------------------------------------------------------------------------------- |
| POST   | `/`               | customer       | `{ mechanicId, serviceType, customerLocation?, locationLabel? }` — generates OTP |
| GET    | `/customer`       | customer       | This customer's bookings                                                         |
| GET    | `/mechanic`       | mechanic       | This mechanic's bookings                                                         |
| GET    | `/:id`            | owner or admin | Single booking (for a tracking screen to poll)                                   |
| PATCH  | `/:id/accept`     | mechanic       | `requested` → `accepted`                                                         |
| PATCH  | `/:id/reject`     | mechanic       | `requested` → `rejected`                                                         |
| PATCH  | `/:id/status`     | mechanic       | `{ status: 'onway' \| 'arrived' }`                                               |
| POST   | `/:id/verify-otp` | mechanic       | `{ otp }` — `arrived` → `started`                                                |
| PATCH  | `/:id/complete`   | mechanic       | `{ finalPrice }` — `started` → `completed`                                       |
| POST   | `/:id/payment`    | customer       | `{ paymentMethod: 'cash' \| 'online' }`                                          |
| POST   | `/:id/rating`     | customer       | `{ rating, review? }` — also updates the mechanic's running average rating       |
| PATCH  | `/:id/cancel`     | customer       | Only while still `requested`                                                     |

### Districts (`/api/districts`) — public

`GET /` — all 75 districts + highways. `GET /:id` — one district.

### Services (`/api/services`) — public

`GET /` — the 6 service types.

### Petrol Pumps (`/api/petrol-pumps?districtId=`) — public

### Complaints (`/api/complaints`)

`POST /` (customer) — `{ mechanicId, bookingId?, subject, details? }`

### Admin (`/api/admin`) — all require an admin token

`GET /overview`, `GET /users`, `GET /mechanics`, `PATCH /mechanics/:id/verify`,
`GET /bookings`, `GET /payments`, `GET /complaints`, `PATCH /complaints/:id/resolve`

---

## Real-time (Socket.IO)

The server emits into rooms that controllers already target on every status
change, so a client just needs to join and listen:

```js
const socket = io("http://localhost:5000");
socket.emit("join_booking", bookingId);
socket.on("status_changed", ({ status }) => {
  /* update UI */
});
socket.on("payment_settled", ({ paymentStatus }) => {
  /* update UI */
});

// Mechanic dashboard:
socket.emit("join_mechanic", mechanicId);
socket.on("new_request", (booking) => {
  /* show incoming request */
});

// Optional live GPS while en route:
socket.emit("mechanic_location_update", { bookingId, lat, lng });
// customer side:
socket.on("mechanic_location", ({ lat, lng }) => {
  /* move the pin */
});
```

---

## Project structure

```
backend/
├── server.js                  # app bootstrap, routes mount, socket.io init
├── .env.example
├── src/
│   ├── config/                # env.js, db.js
│   ├── models/                # User, Mechanic, Booking, Complaint, District, Service, PetrolPump
│   ├── middleware/             # auth.js (JWT + role guard), errorHandler.js
│   ├── controllers/            # one file per resource, thin route handlers
│   ├── routes/                 # one file per resource
│   ├── sockets/                # socket.io room wiring
│   ├── utils/                  # ApiError, token signing, OTP generator, schema helpers
│   └── seed/                   # seed.js + districtsData.js (75 districts, generated from the frontend mock)
```

## Design notes

- **Why slugs as `_id` for District/Service?** So `mechanic.districtId` can
  reference `"gorakhpur"` directly — no join table needed, and it matches
  the frontend mock's existing `districtId` values exactly.
- **Why a custom `toJSON` transform on every model?** So API responses come
  back as `{ id, ... }` instead of Mongo's `{ _id, __v, ... }`, matching the
  shape the frontend already expects from its mock `BookingContext`.
- **Distance calculation** uses the haversine formula against the
  mechanic's stored `location` and the customer's supplied `lat`/`lng` —
  this replaces the frontend mock's static `distanceKm` numbers with a real
  calculation once wired up.
- **Rating** is stored per-booking and rolled into a running average on the
  mechanic document (`(oldAvg * oldCount + newRating) / (oldCount + 1)`),
  rather than recomputing from every booking on each read.
- **Payments**: `submitPayment` only records the method and marks
  `paid`/`due` — a real online-payment integration (e.g. Razorpay) would sit
  between the client's payment confirmation and this endpoint, verifying a
  signature before calling it. Not implemented, flagged in code comments.

## Connecting the frontend

The frontend currently runs entirely on `localStorage` mock data
(`AuthContext`, `BookingContext`) and does not call this API yet. To wire
them together:

1. In `frontend/`, copy `.env.example` to `.env` (already points at
   `http://localhost:5000/api`).
2. Replace the mock functions in `AuthContext`/`BookingContext` with calls
   through `frontend/src/utils/api.js`, using the endpoints above — same
   function names (`login`, `createBooking`, `acceptBooking`, `verifyOtp`,
   etc.), just swapping the implementation from `localStorage` to `axios`.
3. Store the JWT under the `hh_token` key in `localStorage` on
   login/register — `api.js` already attaches it to every request.

Happy to do this wiring in a follow-up if you'd like the frontend switched
over to live API calls instead of mock data.
