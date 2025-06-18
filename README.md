# hike-shabab-server

# 🥾 HikeShabab — Full Stack Hiking Reservation System

*HikeShabab* is a web application designed for managing and reserving hiking trips in Jordan.  
Users can explore upcoming hikes, reserve spots, and view their bookings. Admins can manage hike schedules and track user reservations.

---

## 🛠 Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Frontend     | React + React-Bootstrap             |
| Backend      | Node.js + Express.js                |
| Database     | PostgreSQL                          |
| Styling      | CSS Modules / Bootstrap             |
| API Requests | Axios                               |
| Auth         | LocalStorage (JWT not used)         |

---

## 📁 Project Structure


```
hikeshabab/
│
├── client/               # React app
│   ├── components/       # Reusable UI components
│   ├── css/              # Component styles
│   └── App.jsx           # Main router
│
├── server/               # Express.js API
│   ├── routes/           # Route handlers (auth, hikes, admin, reservations)
│   ├── db.js             # PostgreSQL connection
│   ├── schema.sql        # SQL to create tables
│   ├── data.sql          # Seed data
│   └── index.js          # Server entry point

```
---

## ⚙ Setup Instructions

### 🐘 PostgreSQL Setup

1. Create the DB:
```bash
sql
CREATE DATABASE hikeshabab;
```

2. Import schema & seed:
```bash
psql -U postgres -d hikeshabab -f schema.sql
psql -U postgres -d hikeshabab -f data.sql
```

3. Example connection URL:

```bash
postgresql://postgres:0000@localhost:5432/hikeshabab
```

---

### 🔧 Backend Setup

```bash
cd server
npm install
```

Create a .env file:
```bash
env
DATABASE_URL=postgresql://postgres:0000@localhost:5432/hikeshabab
PORT=3001
```

Run the server:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd client
npm install
```

Add your .env for weather API:
```bash
env
VITE_WEATHER_API_KEY=your_api_key
```

Run the app:

```bash
npm run dev
```

---

## 🔐 Authentication

* *POST /api/auth/signup*
  → { name, email, password, role }

* *POST /api/auth/login*
  → { email, password }

Auth is stored in localStorage. No JWT is used for now.

---

## 📦 API Endpoints

### 🧍 Auth

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | /api/auth/signup | Register new user   |
| POST   | /api/auth/login  | Login existing user |

---

### 🥾 Hikes

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | /api/hikes      | All upcoming hikes             |
| GET    | /api/hikes/\:id | Details for one scheduled hike |

---

### 📆 Reservations

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| POST   | /api/reservations             | Make a reservation               |
| GET    | /api/reservations/\:userId    | Get user's upcoming reservations |
| DELETE | /api/reservations/delete/\:id | Cancel reservation by ID         |

---

### 🛠 Admin Endpoints (requires x-role: admin)

| Method | Endpoint                                   | Description                      |
| ------ | ------------------------------------------ | -------------------------------- |
| GET    | /api/admin/stats                           | Get overall stats (counts)       |
| POST   | /api/admin/                                | Add a new hike schedule          |
| GET    | /api/admin/hike-schedule/all               | Get all scheduled hikes          |
| PUT    | /api/admin/\:id                            | Update an upcoming hike schedule |
| DELETE | /api/admin/\:id                            | Delete a hike (only future ones) |
| GET    | /api/admin/hike-schedule/\:id/reservations | View users reserved for a hike   |

> These endpoints are protected with the adminAuth middleware, checking the request header x-role.

---

## 🧪 Test Users

```bash
# Admin
Email: admin@hikeshabab.com
Password: admin

# User
Email: user1@example.com
Password: 123456
```

---

## ✅ Features

* Browse & filter upcoming hikes
* View hike details + real-time weather
* Reserve and cancel hikes
* See your upcoming reservations
* Admin dashboard for hike management
* Role-based access and local storage auth

---

## 🌐 Deployment Notes

| Component | Suggested Host         |
| --------- | ---------------------- |
| Frontend  | Vercel / Netlify       |
| Backend   | Railway / Render       |
| Database  | Supabase / ElephantSQL |

---

## 💬 Developer Notes

* PostgreSQL only — no MongoDB used
* Auth is localStorage-based for simplicity
* Weather is fetched from WeatherAPI
* Bootstrap used for quick responsive layout

---

## 📄 License

MIT License
© 2025 HikeShabab Team
