<div align="center">

# 🛒 Nenrasha — E-Commerce Platform

**A full-stack, production-ready e-commerce system built on the FULL stack.**
Featuring secure authentication, PayPal payments, an admin order panel, real-user testimonials, and full Docker containerization.
**https://nenrasha.vercel.app/**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-nenrasha.vercel.app-6c63ff?style=for-the-badge)](https://nenrasha.vercel.app/)
[![Docker Hub](https://img.shields.io/badge/🐳%20Docker%20Hub-manthan0000-blue?style=for-the-badge&logo=docker)](https://hub.docker.com/u/manthan0000)
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🔑 Environment Variables](#-environment-variables)
- [💻 Running Locally (Without Docker)](#-running-locally-without-docker)
- [🐳 Running with Docker](#-running-with-docker)
- [🚀 Docker Hub — Prebuilt Images](#-docker-hub--prebuilt-images)
- [🏗 Docker Architecture](#-docker-architecture)
- [🔒 Security Features](#-security-features)
- [📈 Future Improvements](#-future-improvements)
- [👨‍💻 Author](#-author)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure JWT-based registration & login with OTP-driven "Forgot Password" via [Resend](https://resend.com/) |
| 🛍 **Product Management** | Browse, filter, and view products with a full **5-star rating system** |
| 💬 **Testimonials** | Real-user reviews surfaced as testimonials across the storefront |
| 🧑‍💼 **Admin Order Panel** | Dedicated admin portal to view and update order status at the **item level** |
| 💳 **Payment Gateways** | Integrated **PayPal Sandbox** and **Mock Pay** for flexible checkout testing |
| 🖼 **Media Management** | Cloudinary-powered image upload, storage, and delivery pipeline |
| 🐳 **Full Docker Support** | Complete `Dockerfile` + `docker-compose.yml` for both dev and production environments |

---

## 🛠 Tech Stack

### Frontend

| | Technology |
|---|---|
| ⚛️ **Framework** | React 19 (via Vite) |
| 🎨 **UI Library** | Material-UI (MUI v7) + Emotion engine |
| 🔀 **Routing** | React Router DOM v7 |
| 💳 **Payments** | `@paypal/react-paypal-js` |
| 🚀 **Build & Dev Server** | Vite |
| 🌐 **Static Serving (Prod)** | Nginx |

### Backend

| | Technology |
|---|---|
| 🟢 **Runtime** | Node.js with Express.js v5 |
| 🗄 **Database** | MongoDB + Mongoose ODM |
| 🔑 **Auth** | JWT (`jsonwebtoken`) + `bcryptjs` |
| 🖼 **Image Uploads** | Multer + Streamifier + Cloudinary v2 |
| 📧 **Email Delivery** | Resend SDK |
| 💰 **Payments** | `@paypal/checkout-server-sdk` |

---

## 🔑 Environment Variables

Create a `.env` file inside the `Backend/` directory with the following keys:

```env
# MongoDB
MONGO_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
PORT=5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL=your_sender_email

# PayPal (Sandbox)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

> **Note:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## 💻 Running Locally (Without Docker)

### 1. Backend

```bash
# From the project root
cd Backend
npm install
npm run dev
```

The backend will start on **http://localhost:5000**

### 2. Frontend

```bash
# From the project root
cd Frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**

> **Tip:** Set `VITE_API_URL=http://localhost:5000` in `Frontend/.env` if your backend is running on a custom host/port.

---

## 🐳 Running with Docker

Nenrasha is fully containerized with separate Dockerfiles for the frontend (Nginx-served) and backend (Node 20 Alpine).

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- `Backend/.env` file properly configured (see [Environment Variables](#-environment-variables))

### Option 1 — Build & Run Locally with Docker Compose

```bash
# From the project root — builds images and starts all containers
docker-compose up --build

# To run in the background (detached mode)
docker-compose up --build -d
```

**Access the application:**

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5000 |

**Stop all containers:**

```bash
docker-compose down
```

---

## 🚀 Docker Hub — Prebuilt Images

Nenrasha's images are published to Docker Hub so you can spin up the app **without building locally**.

🔗 **Docker Hub:** [hub.docker.com/u/manthan0000](https://hub.docker.com/u/manthan0000)

### Step 1 — Pull the images

```bash
docker pull manthan0000/nenrasha-backend
docker pull manthan0000/nenrasha-frontend
```

### Step 2 — Run the Backend

```bash
docker run -d \
  -p 5000:5000 \
  --env-file Backend/.env \
  --name nenrasha_backend \
  manthan0000/nenrasha-backend
```

### Step 3 — Run the Frontend

```bash
docker run -d \
  -p 3000:80 \
  --name nenrasha_frontend \
  manthan0000/nenrasha-frontend
```

### Step 4 — Access

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5000 |

---

## 🏗 Docker Architecture

```
Nenrasha/
├── Backend/
│   └── Dockerfile       → node:20-alpine | production-optimized Node server on :5000
├── Frontend/
│   └── Dockerfile       → Vite build → Nginx Alpine static server on :80 (mapped to :3000)
└── docker-compose.yml   → Orchestrates both services with automatic restart
```

| Service | Base Image | Build Strategy | Port |
|---|---|---|---|
| `nenrasha_backend` | `node:20-alpine` | Install production deps, run Express | `5000` |
| `nenrasha_frontend` | Multi-stage: `node` → `nginx:alpine` | Vite build, copy `dist/` to Nginx | `3000 → 80` |

---

## 🔒 Security Features

- **JWT Authentication** — Stateless, token-based session management
- **Password Hashing** — `bcryptjs` with salt rounds for secure storage
- **OTP Password Reset** — Time-limited OTP delivered via email (Resend)
- **Protected Routes** — Middleware-guarded API endpoints on the backend
- **Environment Isolation** — All secrets stored in `.env`, never hardcoded

---

## 📈 Future Improvements

- [ ] Stripe / Razorpay payment integration
- [ ] AI-based product recommendations
- [ ] Real-time order tracking (WebSockets)
- [ ] Advanced analytics dashboard for admins
- [ ] Mobile-first responsive redesign

---

## 👨‍💻 Author

**Manthan Jasoliya**
*IIIT Vadodara — Developer |  AI Enthusiast*

---

<div align="center">

⭐ **If you find this project useful, please star the repository and share it!** ⭐

*Nenrasha is built as a real-world scalable system — covering authentication, payments, admin workflows, and full cloud deployment.*

</div>
