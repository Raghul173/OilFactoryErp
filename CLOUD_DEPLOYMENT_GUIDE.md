# 🛢️ SmartOil Factory — Cloud Deployment & Setup Guide

This guide provides step-by-step instructions for deploying the **OilFactory ERP** platform across **Free Cloud MySQL**, **Render (Backend API & Socket.io)**, and **Vercel (React Frontend)**.

---

## 📋 Architecture Stack Summary

| Component | Technology | Cloud Host | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS | **Vercel** | **Free ($0/mo)** |
| **Backend API** | Node.js + Express + Socket.io | **Render** | **Free ($0/mo)** |
| **Database** | MySQL (with Prisma ORM) | **TiDB Cloud / Aiven** | **Free ($0/mo)** |
| **Real-Time** | WebSockets (Socket.io) | Integrated on Render | **Free ($0/mo)** |

---

## 🚀 Phase 1: Create a 100% Free Cloud MySQL Database

We recommend **TiDB Cloud Serverless** (Native MySQL compatible, 5GB storage, 0 credit card needed) or **Aiven for MySQL**.

### Option A: TiDB Cloud (Recommended - 2 Minutes)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and click **Sign Up** (Sign in with GitHub/Google).
2. Click **Create Cluster** -> Select **Serverless** (Free tier).
3. Choose your preferred region (e.g., `AWS / us-east-1` or closest to you).
4. Click **Create**.
5. Once created, click **Connect**:
   - Choose **Prisma** or **General MySQL Client**.
   - Copy the connection string. It will look like:
     ```text
     mysql://[username]:[password]@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/oilfactory_db?sslaccept=strict
     ```
6. Save this connection string for the backend `.env` and Render dashboard!

---

## ⚙️ Phase 2: Local Development & Database Migration

Before deploying to the cloud, you can test locally or run migrations against your cloud database:

### 1. Configure Backend Environment
Open `backend/.env` and paste your MySQL connection string:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="your-mysql-connection-string-here"
JWT_SECRET="smartoil_enterprise_super_secret_jwt_key_2026_x89a_production_grade"
ADMIN_EMAIL="raghuluma2006@gmail.com"
CORS_ORIGIN="http://localhost:5173"
```

### 2. Push Schema & Seed Initial Data
Open a terminal in the `backend/` directory and run:
```bash
cd backend
npx prisma db push
npm run prisma:seed
```
*This creates the `User`, `InventoryItem`, `ProductionBatch`, `SalesOrder`, and `SupplierIntake` tables and seeds the initial 5 oil tanks!*

### 3. Start Backend & Frontend
* **Start Backend**:
  ```bash
  cd backend
  npm run dev
  ```
  *(Server runs at `http://localhost:5000` with live Socket.io).*

* **Start Frontend**:
  ```bash
  npm run dev
  ```
  *(Vite runs at `http://localhost:5173`).*

---

## 🌐 Phase 3: Deploy Backend API to Render (Free)

1. Push your code to your **GitHub** repository.
2. Go to [https://render.com](https://render.com) and sign in.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name**: `oilfactory-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `your_cloud_mysql_connection_string`
   - `JWT_SECRET` = `a-random-secret-key-at-least-32-chars`
   - `CORS_ORIGIN` = `https://your-frontend-app.vercel.app,http://localhost:5173`
   - `ADMIN_EMAIL` = `raghuluma2006@gmail.com`
7. Click **Create Web Service**.
8. Copy your Render API URL once live (e.g., `https://oilfactory-api.onrender.com`).

---

## ⚡ Phase 4: Deploy Frontend to Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set Framework Preset: **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://oilfactory-api.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://oilfactory-api.onrender.com`
   - *(Optional)* `VITE_GOOGLE_CLIENT_ID` = `your-google-client-id.apps.googleusercontent.com`
6. Click **Deploy**.
7. Vercel will build and assign your live production URL (e.g. `https://smartoil.vercel.app`)!

---

## 🔒 Security Best Practices Implemented
* **Atomic DB Transactions**: Multi-user inventory additions and deductions run in ACID transactions to prevent overselling or race conditions.
* **Bcrypt Password Hashing**: Passwords are salted and hashed with bcrypt before saving.
* **Role-Based Access Control (RBAC)**: Administrator, Factory Manager, and Staff permission gates on all destructive endpoints.
* **Rate Limiting & Helmet**: Protects against brute-force logins and secures HTTP headers.
* **Live Socket.io Sync**: Instant cross-device synchronization without polling.
