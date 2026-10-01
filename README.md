# Water Refilling Delivery Log

## Purpose
A web app for a water refilling station to record deliveries: the customer,
address, number of containers, delivery date, and whether it has been paid.

## Tech Stack
React (Vite), Node.js + Express, MongoDB (Mongoose), Git/GitHub

## Why MongoDB
A delivery is one self-contained record, so MongoDB's document model fits it
naturally without needing several related tables. Mongoose lets me define a
schema with data types and validation, so the data stays consistent while the
structure stays easy to change when I add new fields. Setup is quick because no
tables must be created first, and the data is stored permanently, so records
remain after the server restarts. Compared with SQL, it needs less setup and no
joins for a simple single-record application like this one.

## Project Structure
```
server/   Express API + MongoDB connection
client/   React interface (Vite)
```

## How to Install and Run

### Backend
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and set `MONGO_URI`
4. `npm run dev` (runs on http://localhost:5000)

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev` (runs on http://localhost:5173)

## API Routes
| Method | Route | Description | Success status |
|---|---|---|---|
| POST | /api/deliveries | Add a delivery | 201 |
| GET | /api/deliveries | List all deliveries | 200 |
| PUT | /api/deliveries/:id | Update a delivery | 200 |
| DELETE | /api/deliveries/:id | Delete a delivery | 200 |

Errors: 400 (invalid or missing data), 404 (delivery not found), 500 (server error).
