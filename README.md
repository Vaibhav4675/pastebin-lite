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

