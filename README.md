# 🚗 Highway-help

**Highway-help** is a full-stack roadside vehicle assistance platform that helps users find and book nearby mechanics during vehicle breakdowns.

## ✨ Features

* 👤 Customer & Mechanic Login/Register
* 📍 GPS-based nearby mechanic search
* 🔧 Mechanic service listing
* 📅 Service booking
* 🚗 Mechanic tracking
* 🔐 OTP verification
* 💳 Online payment
* ⭐ Rating & reviews
* 🛠️ Admin dashboard

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Authentication:** JWT
**Maps:** GPS / Geolocation API

## 🚀 Run Locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 2. Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

> **Windows users:** If `cp` doesn't work, simply copy `.env.example` and rename the copy to `.env`.

## 🔐 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

⚠️ **Never upload `.env` or API keys to GitHub.**

## 👨‍💻 Author

**Manish Gupta** — MCA | Full Stack Developer
