# Pastebin Lite

A lightweight Pastebin-style application that allows users to create text pastes, share them via a link, and optionally expire them by **time-to-live (TTL)** or **maximum views**.

Built using **Next.js (App Router)**, **Node.js**, and **PostgreSQL**, and designed to work correctly in **serverless environments**.

---

## ✨ Features

- Create a paste with text content
- Optional expiration:
  - **TTL (seconds)**
  - **Max views**
- Shareable link for each paste
- JSON API + HTML view
- Deterministic time testing support
- Serverless-safe persistence (no in-memory state)

---

## 🧩 Tech Stack

- Next.js (App Router)
- Node.js
- PostgreSQL
- Prisma ORM
- Vercel (deployment)

---

## Running the App Locally

## Steps
1. Install Dependencies
   ```bash
   npm install
   ```
2. Create a `.env` in the project root
   ```env
   DATABASE_URL=postgres://username:password@host:5432/dbname
    ```
   (Optional, for deterministic TTL testing)
   ```
   TEST_MODE=1
    ```
3. Run Database Migrations
   ```bash
   npx prisma migrate dev
   ```
4. Run development server
   ```bash
   npm run dev
   ```
   The app will be available at:
   ```arduino
   http://localhost:3000
    ```
---

## Persistence Layer
- **PostgreSQL** is used as the persistence layer.
- **Prisma ORM** is used for database access and migrations.
- All paste data, expiration timestamps, and view counts are stored in the database.
- No in-memory or global mutable state is used, ensuring correctness in serverless environments.

---

## Important Design Decisions
- **Serverless-safe architecture:** All mutable state lives in the database to ensure correctness across serverless invocations.
- **View counting:** Both API (`GET /api/pastes/:id`) and HTML (`/p/:id`) access consume a view.
- **Expiration handling:** Pastes become unavailable when TTL has expired, or maximum view count is reached. Unavailable pastes return HTTP `404`.
- **Security:** Paste content is rendered as escaped text to prevent script execution.

--- 

## 📡 API Endpoints

### Health Check
```json
GET /api/healthz
```
- Always returns HTTP `200`
- JSON response reflects database connectivity

---

### Create Paste
```json
POST /api/pastes
```

**Request Body**
```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 3
}
```
- content (required, non-empty string)
- ttl_seconds (optional, integer ≥ 1)
- max_views (optional, integer ≥ 1)

**Response**
```json
{
  "id": "abc123",
  "url": "https://<deployment-domain>/p/abc123"
}
```
---

### Fetch Paste (Counts as a View)
```json
GET /api/pastes/:id
```
**Response (200)**
```json
{
  "id": "abc123",
  "content": "Hello world",
  "expires_at": "2025-01-01T00:00:00.000Z",
  "remaining_views": 2
}
```
**Unavailable cases (expired, max views reached, or not found):**
- HTTP `404`
- JSON error response
  
  ---

## HTML View (Counts as a View)
```bash
GET /p/:id
```
- Renders paste content safely as HTML
- Returns HTTP `404` if unavailable
- HTML view consumes a view

---

## Links
**Deployed App:**  [Pastebin](pastebin-lite-vert-rho.vercel.app)
