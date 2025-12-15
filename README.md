# Employee Leave Management System

A minimal web app where employees request leave and admins approve/reject.

- Backend: Node.js, Express.js, MongoDB, JWT, bcrypt, express-validator
- Frontend: React (Vite), axios, react-router-dom, Bootstrap

## Folder Structure

```
Employee-Leave-Management-System/
├─ server/
│  ├─ src/
│  │  ├─ config/db.js
│  │  ├─ index.js
│  │  ├─ middleware/{auth.js, roles.js}
│  │  ├─ models/{User.js, Leave.js}
│  │  ├─ routes/{auth.js, leaves.js}
│  │  └─ utils/logger.js
│  ├─ .env
│  └─ package.json
└─ client/
   ├─ index.html
   ├─ vite.config.js
   └─ src/
      ├─ api.js
      ├─ main.jsx
      ├─ App.jsx
      ├─ components/{ProtectedRoute.jsx, ApplyLeaveForm.jsx, LeaveTable.jsx}
      └─ pages/{Login.jsx, Dashboard.jsx}
```

## Prerequisites

- Node.js 18+
- A MongoDB instance (Atlas connection string or local MongoDB)

## 1) Backend Setup

1. Install dependencies and create environment variables

```powershell
cd server
npm install
```

Create a `.env` file in `server` (example):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.<id>.mongodb.net/leave-management
JWT_SECRET=change-this-to-a-strong-random-string
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123
```

- `MONGO_URI` can point to Atlas or local MongoDB (e.g. `mongodb://localhost:27017/leave-management`).
- On server start, an admin user is auto-created if it doesn’t exist (using `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

2. Run the server

```powershell
npm run dev
```

Expected logs:
- `MongoDB connected successfully`
- `Admin user created successfully` (first run) or `Admin user already exists`
- `Server is running on port 5000`

### Manual Seeding (Optional)

Use these one-liners to create/reset users if needed.

- Recreate Admin:
```powershell
node -e "require('dotenv').config(); const mongoose=require('mongoose'); const User=require('./src/models/User'); (async()=>{ await mongoose.connect(process.env.MONGO_URI); await User.deleteOne({email:process.env.ADMIN_EMAIL}); const u=new User({name:'Admin User',email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD,role:'admin'}); await u.save(); console.log('Admin recreated'); await mongoose.disconnect(); })();"
```

- Create/Reset Employee:
```powershell
node -e "require('dotenv').config(); const mongoose=require('mongoose'); const User=require('./src/models/User'); (async()=>{ await mongoose.connect(process.env.MONGO_URI); let u=await User.findOne({email:'employee@example.com'}); if(!u){u=new User({name:'Employee One',email:'employee@example.com',password:'employee123',role:'employee'}); await u.save(); console.log('Employee created');} else {u.password='employee123'; await u.save(); console.log('Employee password reset');} await mongoose.disconnect(); })();"
```

## 2) Frontend Setup

1. Install and run

```powershell
cd client
npm install
# optional but recommended - create client/.env with API base
# echo VITE_API_BASE_URL=http://localhost:5000 > .env
npm run dev
```

- Open the URL printed by Vite (usually http://localhost:5173).

2. Login Credentials

- Admin: `admin@company.com` / `admin123`
- Employee (if seeded above): `employee@example.com` / `employee123`

## API Overview

- Auth
  - `POST /auth/login` — Login (Admin & Employee)
- Leaves (Employee)
  - `POST /leaves` — Create a leave request `{ startDate, endDate, reason }`
  - `GET /leaves/my-leaves` — Fetch own history
- Leaves (Admin)
  - `GET /leaves/all` — Fetch all requests
  - `PUT /leaves/:id/status` — Update status to `Approved` or `Rejected`

## Business Rules

- End date must not be before start date.
- Backend calculates `totalDays` (inclusive of start and end dates).

## Validation & Audit (Bonus)

- `express-validator` is used on auth and leaves endpoints.
- Admin actions (approve/reject) are logged into each leave’s `audit` array and printed via a simple logger.

## Common Issues & Fixes

- 401 Unauthorized when loading dashboard after login:
  - Ensure the frontend sends the JWT (stored in `localStorage`) — this app’s `axios` instance adds `Authorization: Bearer <token>` automatically.
  - If issues persist, logout (clears storage) and login again.

- Invalid credentials:
  - Ensure the admin is created on server start, or manually recreate admin with the seeding command above.
  - Ensure `MONGO_URI` is valid and server shows `MongoDB connected successfully`.

- MongoDB connection errors:
  - Verify credentials/cluster in `MONGO_URI` or use local MongoDB.
  - Make sure the database name suffix exists (e.g., `/leave-management`).

## Submission Checklist (Guidance.md)

- [x] Backend: Node/Express/MongoDB with JWT + bcrypt
- [x] Roles: Employee/Admin with route-level checks
- [x] Endpoints: login, create leave, my-leaves, all, approve/reject
- [x] Business Logic: end date >= start date, totalDays calculation
- [x] Frontend: Login + minimal dashboards for roles
- [x] Bonus: Validation + Audit logging
- [x] Folder structure: `/server`, `/client`
- [x] README: setup & admin seeding instructions

## License

For assignment/demo purposes.
