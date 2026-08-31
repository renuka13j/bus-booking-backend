# TravelEase — Bus Ticket Booking Platform (Backend)

REST API powering the TravelEase bus ticket booking platform — handles authentication, trip search, and race-condition-safe seat booking.

**Live API:** https://bus-booking-backend-s1n3.onrender.com
**Frontend Repo:** https://github.com/renuka13j/bus-booking-frontend

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (user/admin)
- Case-insensitive trip search by source, destination, and date
- Atomic, race-condition-safe seat booking using MongoDB array filters
- Booking cancellation with automatic seat release
- Admin endpoints for managing operators, routes, and trips

## Tech Stack

- **Node.js** / **Express.js** — server and routing
- **MongoDB** (Atlas) / **Mongoose** — database and ODM
- **JWT** — authentication
- **bcryptjs** — password hashing

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/trips` | List all trips |
| GET | `/api/trips/search` | Search trips by source/destination/date |
| GET | `/api/trips/:id` | Get a single trip with seat map |
| POST | `/api/bookings` | Create a booking (protected) |
| GET | `/api/bookings/my` | Get logged-in user's bookings (protected) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking (protected) |
| POST | `/api/admin/operators` | Create an operator (admin only) |
| POST | `/api/admin/routes` | Create a route (admin only) |
| POST | `/api/admin/trips` | Create a trip (admin only) |

## Getting Started Locally

```bash
git clone https://github.com/renuka13j/bus-booking-backend.git
cd bus-booking-backend
npm install
```

Create a `.env` file:

Run the server:
```bash
npm run dev
```

## Related

- [Frontend repository](https://github.com/renuka13j/bus-booking-frontend) — React UI, seat selection, booking flow
