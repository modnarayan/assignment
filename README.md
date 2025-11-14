# Revest Assignment — Microservices + Dynamic Form

**Full-stack solution** with:

* 2 NestJS microservices (Product & Order) using REST APIs
* Inter-service communication (Order → Product)
* Dockerized PostgreSQL (no external DB URL required)
* Next.js 14 (App Router) + MUI + Dynamic JSON-driven Form (TEXT, LIST, RADIO)

---

## Project structure

```
assignment/
├── backend/
│   ├── apps/
│   │   ├── product-service/
│   │   └── order-service/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── package.json
│
└── README.md
```

---

## Overview

This repository provides a sample implementation for a microservice-based e-commerce flow:

* **Product service**: CRUD for products, stock management.
* **Order service**: Create orders, validate stock by calling Product service, reduce stock on successful order.
* **Key API**: `GET /orders/with-products` — returns orders with full product details embedded.
* **Frontend**: Next.js 14 App Router + MUI with a dynamic JSON-driven form (supports `TEXT`, `LIST`, `RADIO`) validated via Zod + React Hook Form and persisted to `localStorage`.

Everything is dockerized for easy local setup.

---

## Clone the Repository

Clone the project first:

```bash
git clone https://github.com/modnarayan/assignment.git
cd assignment
```

## Quick start — Backend (Docker)

> These steps assume you are at the repository root (`assignment/`).

1. Open terminal and go to backend:

```bash
cd backend
```

2. Copy the example env file (no edits required in the default setup):

```bash
cp .env.example .env
```

3. Start PostgreSQL and the two services (detached):

```bash
docker-compose up -d
```

4. Services will be available at:

* Product Service: `http://localhost:3000`
* Order Service: `http://localhost:3001`

5. To stop and remove containers:

```bash
docker-compose down
```

---

## Backend — API Examples

### Product Service ([http://localhost:3000](http://localhost:3000))

**Create product**

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15","price":1299.99,"stock":10}'
```

**Get products**

```bash
curl http://localhost:3000/products
```

**Update product**

```bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15 Pro","price":1499.99,"stock":8}'
```

**Delete product**

```bash
curl -X DELETE http://localhost:3000/products/1
```

### Order Service ([http://localhost:3001](http://localhost:3001))

**Create order** (this will validate stock by calling Product service and reduce stock on success)

```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

**Get orders with products** — key feature

```bash
curl http://localhost:3001/orders/with-products
```

**Success response sample**

```json
[
  {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "totalPrice": 2599.98,
    "status": "completed",
    "product": {
      "id": 1,
      "name": "iPhone 15",
      "price": 1299.99,
      "stock": 8
    }
  }
]
```

---

## Frontend — Next.js + MUI (Local)

1. Open a new terminal (from repo root):

```bash
cd frontend
npm install
npm run dev
```

2. Open the app at: `http://localhost:3000`

3. **Dynamic Form**

* The form is JSON-driven. Edit `frontend/app/page.tsx` and change `formJson.data` to experiment.

Example JSON snippets and resulting behavior:

```ts
// TEXT number field (maxLength 3, required)
{
  name: "Age",
  fieldType: "TEXT",
  maxLength: 3,
  required: true
}

// LIST (dropdown)
{
  name: "Gender",
  fieldType: "LIST",
  listOfValues1: ["Male","Female","Others"],
  required: true
}
```

Validation is implemented with **Zod + React Hook Form**. Form values are persisted to `localStorage` so refresh retains values.

---

## .env example (backend/.env.example)

```
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=revest_db
POSTGRES_PORT=5432

# Product service
PRODUCT_SERVICE_PORT=3000
PRODUCT_DB_URL=postgres://postgres:postgres@postgres:5432/revest_db

# Order service
ORDER_SERVICE_PORT=3001
ORDER_DB_URL=postgres://postgres:postgres@postgres:5432/revest_db

# Other config
NODE_ENV=development
```

> The docker-compose file sets up a `postgres` container and links both services to it using the `postgres` hostname — so you don't need a remote DB URL.

---

## Implementation notes & highlights

* NestJS microservices use **TypeORM** for DB access and **Axios** (or internal HTTP) for inter-service calls.
* Order creation flow:

  1. Order service receives order request (`productId`, `quantity`).
  2. Order service requests product details and stock from Product service.
  3. If stock is sufficient, Order service creates the order, calculates `totalPrice`, updates product stock (Product service endpoint), and returns `completed`.
  4. If stock is insufficient, returns a `400` with an explanatory message.
* `GET /orders/with-products` joins order rows with product details by calling product service for required product details and assembling the combined payload.
* Frontend focuses on a reusable JSON-driven form that supports three field types and client-side validation.

---

---

## Development tips

* Backend: run each NestJS app individually (without Docker) for faster development:

```bash
# from backend/apps/product-service
npm install
npm run start:dev

# from backend/apps/order-service
npm install
npm run start:dev
```

* Frontend: use Next.js Fast Refresh (already enabled by `npm run dev`).

---

## Useful commands summary

```bash
# Start backend (dockerized)
cd backend && cp .env.example .env && docker-compose up -d

# Stop backend
cd backend && docker-compose down

# Frontend
cd frontend && npm install && npm run dev
```

---


Tell me which one and I will add it.
