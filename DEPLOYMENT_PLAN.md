# Complete Learning Path: Deployment, DevOps & Production (Nenrasha)

Step-by-step, ordered learning guide with explanations and practical application to your project.

---

## **PHASE 1: BUILD CREATION & OPTIMIZATION**
**Why first?** Without understanding builds, CI/CD and Docker won't make sense.

### **1.1 Frontend Build (React/Vite)**
**What it does**: Converts your React code into optimized HTML/JS/CSS for production.

**Current state**: Your frontend uses Vite. Check frontend/vite.config.js

**Key concepts to learn**:
- `npm run build` → Creates `/dist` folder with minified, production-ready files
- Tree-shaking → Removes unused code automatically
- Code splitting → Breaks bundle into smaller chunks for faster loading
- Environment variables → `VITE_API_URL` differs between dev/prod

**Action for your project**:
```bash
cd frontend
npm run build
# Creates dist/ folder (~1-2MB for frontend)
npm run preview  # Test production build locally
```

### **1.2 Backend Build (Node.js)**
**What it does**: Node.js doesn't "build" like React, but you need to:
- Ensure all dependencies are installed
- Run any build scripts
- Optimize for production

**For your project**: Minimal Node.js build compared to frontend.
```bash
cd backend
npm install --production  # Only production dependencies
# Node.js runs directly without compilation
```

### **1.3 Build Artifacts**
- **Frontend**: `dist/` folder (ready to serve)
- **Backend**: `node_modules/` + `src/` files + `.env`

---

## **PHASE 2: ENVIRONMENT CONFIGURATION**
**Why important?** Dev, staging, and production need different settings.

### **2.1 Understand Environment Levels**
```
Development (local) → Staging (test on cloud) → Production (live users)
```

### **2.2 Current .env Setup**
Your backend likely has `.env`:
```
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
PORT=5000
```

**Problem**: `.env` file committed to git = security risk

**Solution**:
1. **Add to `.gitignore`**: (if not already there)
   ```
   backend/.env
   backend/.env.local
   frontend/.env.local
   ```

2. **Environment files for each stage**:
   ```
   backend/.env.development    (local)
   backend/.env.staging        (test server)
   backend/.env.production     (live)
   ```

3. **Frontend needs env too** (frontend/vite.config.js):
   ```javascript
   // .env.development
   VITE_API_URL=http://localhost:5000
   
   // .env.production
   VITE_API_URL=https://api.nenrasha.com
   ```

### **2.3 Secret Management Strategy**
- **Development**: Use `.env` files (local only)
- **Staging/Production**: Use cloud provider's secret manager (AWS Secrets Manager, GitHub Secrets)
- **Never commit secrets** to git

---

## **PHASE 3: CONTAINERIZATION (DOCKER)**
**Why?** Docker ensures your app runs the same everywhere (dev, staging, prod).

### **3.1 Docker Basics**
- **Image**: Blueprint (like a recipe)
- **Container**: Running instance of image (like a cooked meal)
- **Dockerfile**: Instructions to build image

### **3.2 Create Backend Dockerfile**

Create `backend/Dockerfile`:
```dockerfile
# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src ./src
COPY .env.production .env

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "src/server.js"]
```

### **3.3 Create Frontend Dockerfile**

Create `frontend/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage (lightweight)
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 3000;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### **3.4 Create `.dockerignore`** (both frontend & backend)
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
build
```

### **3.5 Test Locally**

```bash
# Build backend image
cd backend
docker build -t nenrasha-backend:1.0 .

# Build frontend image
cd frontend
docker build -t nenrasha-frontend:1.0 .

# Run containers
docker run -p 5000:5000 nenrasha-backend:1.0
docker run -p 3000:3000 nenrasha-frontend:1.0
```

---

## **PHASE 4: DOCKER HUB & IMAGE MANAGEMENT**
**Why?** Docker Hub is container repository (like GitHub for Docker images).

### **4.1 Docker Hub Setup**
1. Create account at https://docker.io
2. Create repositories:
   - `yourusername/nenrasha-backend`
   - `yourusername/nenrasha-frontend`

### **4.2 Push Images to Docker Hub**

```bash
# Login to Docker Hub
docker login

# Tag images with your Docker Hub username
docker tag nenrasha-backend:1.0 yourusername/nenrasha-backend:1.0
docker tag nenrasha-frontend:1.0 yourusername/nenrasha-frontend:1.0

# Push to Docker Hub
docker push yourusername/nenrasha-backend:1.0
docker push yourusername/nenrasha-frontend:1.0

# Tag as 'latest' for easy reference
docker tag nenrasha-backend:1.0 yourusername/nenrasha-backend:latest
docker push yourusername/nenrasha-backend:latest
```

### **4.3 Version Management**
- **Semantic versioning**: `1.0.0`, `1.0.1`, `2.0.0`
- **Tagging strategy**:
  ```
  yourusername/nenrasha-backend:1.0.0      (specific version)
  yourusername/nenrasha-backend:latest     (always latest)
  yourusername/nenrasha-backend:staging    (staging version)
  ```

---

## **PHASE 5: CI/CD PIPELINES**
**Why?** Automate testing, building, and deployment on every code push.

### **5.1 CI/CD Flow Explained**
```
You push code to GitHub 
  ↓
GitHub Actions triggered
  ↓
Run tests, build Docker images
  ↓
Push to Docker Hub
  ↓
Deploy to AWS automatically
```

### **5.2 GitHub Actions Setup**

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      # Check out code
      - uses: actions/checkout@v3
      
      # Set up Node.js
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Login to Docker Hub
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      # Build and push backend
      - name: Build Backend
        run: |
          cd backend
          docker build -t ${{ secrets.DOCKER_USERNAME }}/nenrasha-backend:${{ github.sha }} .
          docker tag ${{ secrets.DOCKER_USERNAME }}/nenrasha-backend:${{ github.sha }} ${{ secrets.DOCKER_USERNAME }}/nenrasha-backend:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/nenrasha-backend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USERNAME }}/nenrasha-backend:latest
      
      # Build and push frontend
      - name: Build Frontend
        run: |
          cd frontend
          docker build -t ${{ secrets.DOCKER_USERNAME }}/nenrasha-frontend:${{ github.sha }} .
          docker tag ${{ secrets.DOCKER_USERNAME }}/nenrasha-frontend:${{ github.sha }} ${{ secrets.DOCKER_USERNAME }}/nenrasha-frontend:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/nenrasha-frontend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USERNAME }}/nenrasha-frontend:latest
```

### **5.3 Set GitHub Secrets**
Go to GitHub repo → Settings → Secrets → Add:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

---

## **PHASE 6: AWS DEPLOYMENT**
**Why?** AWS provides scalable infrastructure for your app.

### **6.1 AWS Services for Your Project**

| Service | Purpose | For Your App |
|---------|---------|-------------|
| **ECS (Elastic Container Service)** | Run Docker containers | Run backend & frontend |
| **RDS (Relational Database)** | Managed database | MongoDB Atlas better (non-SQL) |
| **S3** | File storage | Store product images |
| **CloudFront** | CDN | Serve frontend fast globally |
| **Secrets Manager** | Store secrets | Store `.env` variables |
| **ALB (Application Load Balancer)** | Route traffic | Split frontend/backend traffic |
| **ECR (Elastic Container Registry)** | Store Docker images | Alternative to Docker Hub |

### **6.2 Recommended AWS Architecture**

```
Frontend: CloudFront → S3 (or ECS) 
Backend: ALB → ECS (backend containers)
Database: MongoDB Atlas (external)
Files: S3 (for uploads)
Images: Cloudinary (already using)
```

### **6.3 Simple AWS Deployment Steps**

**Option A: ECS (Recommended for small projects)**
1. Create ECS cluster on AWS
2. Create task definitions (backend + frontend)
3. Push Docker images to ECR
4. Deploy tasks to ECS
5. Set up ALB to route traffic

**Option B: EC2 (Simpler, more manual)**
1. Launch EC2 instance (Ubuntu)
2. Install Docker
3. Pull images from Docker Hub
4. Run containers
5. Set up Nginx reverse proxy

### **6.4 Cost-Effective Approach**
For learning/small scale:
- **Frontend**: Deploy on Vercel/Netlify (free tier available)
- **Backend**: Deploy on Railway, Heroku, or AWS EC2 (t3.micro = eligible free tier)
- **Database**: MongoDB Atlas (free tier: 512MB)
- **Files**: S3 (free tier: 5GB/month)

---

## **PHASE 7: PAYMENT INTEGRATION**
**Why?** Current mock payment needs to be real for production.

### **7.1 Keep Mock for Testing**

Modify backend/src/controllers/orderController.js to support multiple payment methods:

```javascript
// Switch between mock and real payment
if (process.env.PAYMENT_GATEWAY === 'mock') {
  // Use mock payment
  order.paymentStatus = 'Paid';
} else if (process.env.PAYMENT_GATEWAY === 'stripe') {
  // Use Stripe
  // Call Stripe API
}
```

### **7.2 Payment Gateway Options for India**

| Gateway | Pros | Cons |
|---------|------|------|
| **Razorpay** | India-first, easy setup | India only |
| **Stripe** | International, well-documented | Higher fees, requires Stripe account |
| **PayPal** | Global, well-known | Fees |

**Recommendation for India**: Use **Razorpay**

### **7.3 Razorpay Integration Example**

**Install Razorpay SDK**:
```bash
cd backend
npm install razorpay
```

**Backend integration** (add to backend/src/controllers/orderController.js):

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: orderId,
    });

    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const isValid = validateSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (isValid) {
      // Update order status
      const order = await Order.findByIdAndUpdate(
        req.body.orderId,
        { paymentStatus: 'Paid' },
        { new: true }
      );
      res.json({ success: true, order });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend** (add to checkout page):

```javascript
const handlePayment = async () => {
  const response = await fetch('/api/orders/payment-order', {
    method: 'POST',
    body: JSON.stringify({ amount: total, orderId }),
  });

  const { orderId } = await response.json();

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    order_id: orderId,
    handler: async (response) => {
      // Verify payment on backend
      await fetch('/api/orders/verify-payment', {
        method: 'POST',
        body: JSON.stringify(response),
      });
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

---

## **PHASE 8: PRODUCTION FLOW & UPDATES**

### **8.1 Typical Production Workflow**

```
Feature branch → Pull Request → Tests pass → Merge to main
↓
GitHub Actions triggers (CI/CD)
↓
Build Docker images ✅
↓
Push to Docker Hub ✅
↓
Deploy to AWS ✅
↓
Smoke tests ✅
↓
Live for users ✅
```

### **8.2 How to Deploy Updates**

**For small bug fixes**:
```bash
git commit -m "fix: bug description"
git push origin main
# CI/CD automatically handles build & deployment
```

**For major releases**:
```bash
git tag v1.0.1
git push origin v1.0.1
# CI/CD can deploy specific tagged versions
```

### **8.3 Rollback Strategy**

If something breaks:
```bash
# Keep previous Docker image tags
docker pull yourusername/nenrasha-backend:1.0.0
docker run -p 5000:5000 yourusername/nenrasha-backend:1.0.0

# Quickly revert AWS deployment to previous version
```

---

## **LEARNING ORDER SUMMARY**

```
Week 1: Build Creation (Phases 1-2)
├─ Master npm run build
├─ Understand environment variables
└─ Create .env structure

Week 2: Docker (Phase 3-4)
├─ Create Dockerfiles
├─ Test locally
└─ Push to Docker Hub

Week 3: CI/CD (Phase 5)
├─ Set up GitHub Actions
├─ Automate Docker builds
└─ Test pipeline

Week 4: AWS (Phase 6)
├─ Deploy on AWS
├─ Set up load balancer
└─ Configure DNS

Week 5: Payment (Phase 7)
├─ Integrate Razorpay
└─ Test payment flow

Week 6+: Optimization & Monitoring
├─ Add logging
├─ Set up monitoring
└─ Performance tuning
```

---

## **QUICK REFERENCE: DEPLOYMENT ARCHITECTURE**

```
┌─────────────────────────────────────┐
│          User                       │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │  CloudFront CDN │
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────┐          ┌────────▼──┐
│Frontend│          │ ALB (Load │
│(S3)    │          │ Balancer) │
└────────┘          └────────┬──┘
                             │
                    ┌────────▼────────┐
                    │  ECS Cluster    │
                    │ ┌─────────────┐ │
                    │ │Backend (1)  │ │
                    │ ├─────────────┤ │
                    │ │Backend (2)  │ │
                    │ └─────────────┘ │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────┐
                    │ MongoDB Atlas     │
                    │ (or RDS)          │
                    └───────────────────┘
```

---

## **DEPLOYMENT STRATEGY COMPARISON**

### **Option 1: Separate Deployments (RECOMMENDED for your case)**
```
Frontend:  Vercel/Netlify/CloudFront + S3
Backend:   AWS ECS/EC2 or Railway
Database:  MongoDB Atlas
Benefits:
- Easy to update frontend without redeploying backend
- Scale frontend & backend independently
- Frontend cached globally via CDN
```

### **Option 2: Monorepo Docker (Both together)**
```
Everything in one Docker container
Benefits:
- Simpler to manage
- Easier to deploy
Drawbacks:
- Can't update frontend without restarting backend
- Less flexible
```

### **BEST FOR YOU: Option 1 (Separate)**
Allows you to change frontend/backend independently after deployment.

---

## **COST ESTIMATE (Monthly, Free Tier if possible)**

| Service | Free Tier | Paid (if needed) |
|---------|-----------|-----------------|
| GitHub Actions | 2,000 mins/month | $0.008/min extra |
| Docker Hub | Free | $7/month (private) |
| MongoDB Atlas | 512MB storage | $9-500+/month |
| S3 | 5GB/month | $0.023/GB |
| CloudFront | 12 months free | $0.085/GB |
| ECS | Free tier eligible | $0.04-0.20/hour |
| EC2 | t3.micro free 12 months | $8-15/month |
| **TOTAL** | **~$0** | **$200-300/month** |

---

## **ACTION ITEMS - START HERE**

- [ ] Phase 1: Test frontend build locally (`npm run build`)
- [ ] Phase 2: Create `.env.production` files for both frontend & backend
- [ ] Phase 3: Create Dockerfile for backend
- [ ] Phase 3: Create Dockerfile for frontend + nginx.conf
- [ ] Phase 4: Create Docker Hub account, push test images
- [ ] Phase 5: Create GitHub Actions workflow
- [ ] Phase 6: Choose deployment platform (AWS/Railway/Vercel)
- [ ] Phase 7: Integrate Razorpay payment
- [ ] Phase 8: Set up monitoring & logging

---

Generated: March 10, 2026
For: Nenrasha E-commerce Project
