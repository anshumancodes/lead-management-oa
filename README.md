# LeadFlow — Lead Management Dashboard

A **production-grade Lead Management Dashboard** built with the MERN stack and TypeScript-first architecture.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS v4 |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas via Mongoose |
| **Auth** | JWT (Bearer token), bcryptjs password hashing |
| **Deployment** | Frontend → Vercel · Backend → Render |
| **Container** | Docker + Docker Compose (backend only) |

---

## Features

### Authentication & Authorization
- User Registration & Login with JWT
- Password hashing with `bcryptjs` (12 salt rounds)
- Role-Based Access Control (RBAC)
  - **Admin** — full access: create, edit, delete leads, export CSV
  - **Sales User** — can view, create, and edit leads
- Protected routes on both frontend and backend
- `verifyJWT` + `requireRole` middleware architecture

### Leads Management
- Full CRUD — Create, Read, Update, Delete (soft-delete)
- Lead schema: `name`, `email`, `phone`, `status`, `source`, `notes`
- Status: `New` | `Contacted` | `Qualified` | `Lost`
- Source: `Website` | `Instagram` | `Referral`

### Advanced Filtering, Search & Sorting
All filters are composable and work simultaneously:
- Filter by Status
- Filter by Source
- Search by name or email (debounced 350ms on the frontend)
- Sort: Latest First / Oldest First
- Active filter pills with individual remove buttons

### Pagination
- Backend pagination with `skip` / `limit`
- 10 records per page (configurable)
- Response format:
```json
{
  "data": [],
  "pagination": { "total": 120, "page": 2, "limit": 10, "totalPages": 12 }
}
```

### Dashboard UI
- Stat cards: Total Leads, New, Qualified, Lost
- Leads table with status/source badges, row hover, action icons
- Create / Edit / Delete / Detail modals
- Loading skeletons, empty states, error handling
- Responsive layout (sidebar + topbar)
- **Dark Mode** — three-way toggle: Light / Dark / System

### CSV Export
- Export filtered leads as `.csv` (Admin only)
- Respects all active filters (status, source, search)

---

## Project Structure

```
lead-management-oa/
├── server/                  # Express API
│   ├── src/
│   │   ├── config/          # Env config with required() assertion
│   │   ├── types/           # Shared interfaces, enums, DTOs
│   │   ├── schemas/         # Mongoose schemas (User, Lead)
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # Express routers
│   │   ├── common/
│   │   │   └── middlewares/ # auth, error, request logger, response
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── seed.ts          # Demo data seeder
│   ├── Dockerfile
│   └── package.json
│
├── ui/                      # Next.js frontend
│   ├── src/
│   │   ├── types/           # Lead, Auth, API types
│   │   ├── lib/             # axios client, auth helpers, CSV utils
│   │   ├── hooks/           # useAuth, useLeads, useDebounce
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Select, Modal, Spinner, …
│   │   │   ├── leads/       # LeadTable, LeadFilters, LeadForm, badges
│   │   │   └── layout/      # Sidebar, Topbar, ThemeToggle
│   │   └── app/
│   │       ├── login/
│   │       ├── register/
│   │       ├── leads/       # Main dashboard
│   │       ├── providers.tsx
│   │       └── layout.tsx
│   └── package.json
│
├── docker-compose.yml       # Backend container only
├── render.yaml              # Render deployment config (backend)
└── .env.example
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login, receive JWT |
| POST | `/api/v1/auth/logout` | Yes | Logout |
| GET | `/api/v1/auth/me` | Yes | Get current user |

### Leads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/v1/leads` | Yes | Any | List leads (paginated + filtered) |
| GET | `/api/v1/leads/export/csv` | Yes | Admin | Export filtered CSV |
| GET | `/api/v1/leads/:id` | Yes | Any | Get single lead |
| POST | `/api/v1/leads` | Yes | Any | Create lead |
| PATCH | `/api/v1/leads/:id` | Yes | Any | Update lead |
| DELETE | `/api/v1/leads/:id` | Yes | Admin | Soft-delete lead |

### Query Parameters for `GET /api/v1/leads`

| Param | Type | Description |
|-------|------|-------------|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | `string` | Regex search on name + email |
| `sort` | `latest\|oldest` | Sort direction |
| `page` | `number` | Default: `1` |
| `limit` | `number` | Default: `10`, max: `100` |

---

## Running Locally

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local `mongod`)

### Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET

# Seed demo data
npm run seed

# Start dev server (port 3000)
npm run dev
```

### Frontend

```bash
cd ui

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local

# Start dev server (port 3001)
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@demo.com` | `Admin@123` |
| **Sales User** | `sales@demo.com` | `Sales@123` |

---

## Deployment

### Backend → Render

The `render.yaml` at the root handles deployment automatically:

1. Connect the repository to [Render](https://render.com)
2. Render detects `render.yaml` and configures the service
3. Set `MONGO_URI` in the Render dashboard (Environment → Secret Files)
4. Deploy — the health check at `/health` confirms readiness

### Frontend → Vercel

1. Import the repository into [Vercel](https://vercel.com)
2. Set **Root Directory** to `ui`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-render-url.onrender.com/api/v1
   ```
4. Deploy

### Docker (Backend only)

```bash
# Copy and fill in environment variables
cp .env.example .env

# Build and run the backend container
docker-compose up --build
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | `development` / `production` | Yes |
| `PORT` | Server port (default: `3000`) | Yes |
| `MONGO_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | Token expiry (default: `7d`) | No |
| `CORS_ORIGIN` | Allowed origins (`*` or URL) | No |

### UI (`ui/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL including `/api/v1` |
