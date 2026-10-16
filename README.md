# Highway-Help 🚗

Highway-Help is a roadside assistance web application that helps users find nearby mechanics when their bike or car breaks down. It aims to make emergency assistance easier, faster, and more accessible.

## ✨ Features

- **User Authentication:** Secure login and registration using JWT.
- **Nearby Mechanics:** Find mechanics for roadside vehicle assistance.
- **Service Requests:** Request assistance when your vehicle breaks down.
- **Mechanic Dashboard:** Manage service requests and update request status.
- **Admin Dashboard:** Manage users, mechanics, and service verification.
- **Real-Time Updates:** Track service request progress.
- **Online Payments:** Support for online payments using Razorpay.
- **Responsive UI:** User-friendly interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay API

## 📁 Project Structure

```text
Highway-Help/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
└── README.md
```

*Note: The folder structure may vary depending on the current implementation.*

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- Node.js and npm
- Git
- MongoDB or a MongoDB Atlas connection

### 1. Clone the Repository

```bash
git clone https://github.com/manishrauniyar/Highway-help.git
cd Highway-help
```

### 2. Set Up the Frontend

Open a terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal to access the frontend.

### 3. Set Up the Backend

Open a **second terminal** from the project root and run:

```bash
cd backend
npm install
```

Create your environment file by copying the example:

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

Update the `.env` file with your required environment variables, such as the MongoDB connection string, JWT secret, and API credentials.

If your project supports database seeding, run:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Make sure both the frontend and backend are running.

## 🔐 Environment Variables

Configure the variables required by the backend in `backend/.env`. Refer to `backend/.env.example` for the exact variable names.

**Never commit your `.env` file or expose API keys and database credentials on GitHub.**

## 🔮 Future Enhancements

- AI-powered vehicle breakdown assistance.
- Improved map-based mechanic discovery and route visualization.
- Emergency fuel assistance.
- Enhanced real-time service tracking.

## 👨‍💻 Author

**Manish Rauniyar**

- GitHub: [@manishrauniyar](https://github.com/manishrauniyar)

## 📄 License

This project is intended for learning and portfolio development. Add a license file if you choose to distribute it under a specific open-source license.
