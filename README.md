# Nenrasha - E-Commerce Platform

A full-stack, comprehensive e-commerce project built using the MERN-ish stack. Nenrasha includes a robust administrative panel, full purchase flow, multiple payment gateways, product ratings, real-user testimonials, secure authentication with OTP-based password reset, and full complete containerized setups for production and development.

## 🚀 Features

- **User Authentication**: Secure JWT-based registration and login, along with OTP-based "Forgot Password" functionality via Resend.
- **Product Management**: Browse, view, and rate products with a 5-star rating system. Real-user testimonials are highlighted.
- **Admin Order Panel**: Dedicated portal for administrators to view, manage, and update the status of orders at the item level.
- **Payments**: Integrated payment gateways including PayPal Sandbox Testing and Mock Pay.
- **Media**: Built-in Cloudinary ecosystem for smooth product image handling.

## 🛠 Tech Stack

### Frontend
- **Core**: React 19 built with Vite
- **UI & Styling**: Material-UI (MUI), Emotion UI engine
- **Routing**: React Router DOM (v7)
- **Integrations**: `@paypal/react-paypal-js` for frontend checkouts

### Backend
- **Core**: Node.js & Express.js
- **Database**: MongoDB with Mongoose object modeling
- **Authentication**: JsonWebToken (JWT) & bcryptjs
- **Media Uploads**: Multer, streamifier, cloudinary (v2)
- **Email Delivery**: Resend SDK
- **Payment Tools**: `@paypal/checkout-server-sdk`

---

## 💻 Running the Application Locally (Without Docker)

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file containing (example):
   `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and payment/Resend keys.
4. Start the Node development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Optionally configure your environment variables (e.g. `VITE_API_URL`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` if it doesn't open automatically.

---

## 🐳 Running with Docker (Recommended)

Nenrasha is complete with Dockerfiles configured for both the frontend (served via performant Nginx) and the backend (Node 20 alpine).

### Prerequisites
- Docker and Docker Compose installed
- `Backend/.env` file properly configured.

### Using Docker Compose
Running the entire application is simple with the robust `docker-compose.yml` file.

1. In the project root (`Nenrasha`), run the following to build the images and wire up the network automatically:
   ```bash
   docker-compose up --build
   ```
   *(To run the containers in the background, append `-d`)*

2. Enjoy the live application:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

### Stopping Containers
To gracefully shut down the Docker environment:
```bash
docker-compose down
```

### 🏗 Docker Architecture Overview
- **Backend Service** (`nenrasha_backend`): A multi-stage `node:20-alpine` build optimized for production (`npm install --production`), mapped to expose port `5000`.
- **Frontend Service** (`nenrasha_frontend`): Multi-stage Vite build. It first installs dependencies and renders the production `dist` map, which is subsequently copied to a lightweight **Nginx** runner for high-performance static serving out of port `3000`.
