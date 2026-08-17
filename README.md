# Medisphere — Hospital Management System (HMS)

Medisphere is a premium, fullstack, state-of-the-art **Hospital Management System (HMS)** designed for clinical workforce efficiency, patient empowerment, and seamless hospital administration. Built with high-performance modern web aesthetics, it features an Express + MongoDB backend and an interactive React + Vite frontend.

---

## 🌟 Key Features & Functional Modules

### 1. Unified Hospital Staff & Workforce Directory (`/doctors`)
* **Multidisciplinary Staff Directory**: Supports Medical Doctors, Nursing Staff, Lab & Scan Technicians, and Pharmacists/EMTs.
* **Smart Filter & Search Panel**: Bespoke custom-designed search bar with micro-labels, quick-department suggestion chips, and checkmarked animated Framer Motion dropdown popovers.
* **Interactive Counter Cards**: Real-time counters showing total active workforce by department, functioning as interactive toggles for direct filtering.

### 2. Dedicated Dynamic Services Module (`/services/:id`)
* Dedicated landing page rendering dynamic procedures, hardware specifications, and FAQs for key hospital divisions:
  * **Diagnostic Services**: 3T MRI, 128-slice CT scan, Digital X-Rays, Ultrasound.
  * **Laboratory Services**: NABL Accredited pathology labs, home sample collection workflows.
  * **Surgical Services**: Ultra-clean Class 100 Modular Operation Theatres.
  * **24/7 In-House Pharmacy**: Inventory cold-chain tracking and express home deliveries.
  * **Ambulance Services**: Advanced Life Support (ALS) mobile ICUs with transport ventilators.

### 3. Contact & Feedback Desk with SMTP Integration (`/contact`)
* Powered by **Nodemailer** for fully automated email routing.
* **Double-Action Emailing**: 
  1. Instant notification with formatted HTML table containing details of user query forwarded to the admin desk.
  2. Automatic confirmation/acknowledgement auto-reply dispatched to the user's email address.

### 4. Patient Portal (User Dashboard)
* **Appointment Scheduling**: Real-time slot booking matching doctor availability.
* **Health Tracking & Records**: Downloadable prescription histories, vital records (heart rate, blood pressure, etc.), and billing invoices.

### 5. Doctor & Technician Portal
* **Appointments Queue**: Categorized dashboard to track, update status, and manage consultations.
* **E-Prescription & Vitals Engine**: Digitally update patient vitals, write clinical remarks, and issue NABL diagnostic lab tests.
* **Lab Sample & Test Manager**: Manage NABL requests, update sample processing state, and upload test reports.

### 6. Admin Panel
* **Analytics Dashboard**: Performance metrics visualised with Recharts (daily appointment volume, revenue flows, department occupancy).
* **Workforce Registry**: Full CRUD controls to add, update, and manage medical staff profiles.

---

## 📂 Project Architecture & Directory Layout

```bash
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Core business logic (auth, appointments, users)
│   ├── models/             # Mongoose schemas (User, Patient, Doctor, Appointment)
│   ├── routes/             # Express API Endpoints (auth, users, appointments, contact)
│   ├── utils/              # JWT generator, Nodemailer transporter
│   ├── server.js           # Entry point for backend
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets (favicons, hospital banners, app logo)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Buttons, Inputs, Sidebar, Navbar)
│   │   ├── layouts/        # Layout wrappers (PublicLayout, DashboardLayout, UserLayout)
│   │   ├── pages/          # Public and Dashboard pages (Home, Doctors, Services, Admin pages)
│   │   ├── utils/          # Tailwind class merger utilities
│   │   ├── main.jsx        # Global entry point and Axios URL interceptor config
│   │   └── index.css       # Core Tailwind CSS tokens and themes
│   ├── vercel.json         # SPA routing fallback for Vercel
│   └── package.json
│
├── render.yaml             # Multi-service Render deployment template
└── README.md
```

---

## ⚙️ Quick Local Setup

### Prerequisites
* **Node.js** v18 or higher installed.
* **MongoDB** connection string (local instance or MongoDB Atlas).

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create `.env` file from `.env.example` and fill in:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   # SMTP Configuration (e.g. Gmail App Password)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   SMTP_FROM_NAME="Medisphere Support"
   SMTP_FROM_EMAIL=your_email@gmail.com
   CONTACT_RECEIVER_EMAIL=your_email@gmail.com
   ```
3. Install dependencies and start server in development mode:
   ```bash
   npm install
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create `.env` file and set your API base URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Install dependencies and start client server:
   ```bash
   npm install
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`.

---

## 🚀 Production Deployment

### Deploy Backend (on Render)
* Create a **Web Service** pointing to your repository on Render.
* **Build Command**: `cd backend && npm install`
* **Start Command**: `cd backend && npm start` (or `node server.js`)
* **Environment Variables**: Copy all variables from `backend/.env`. Ensure there are no spaces or trailing text in the values.

### Deploy Frontend (on Vercel)
* Import the repository in **Vercel**.
* Set **Root Directory** to `frontend`.
* Vercel will auto-configure build commands (`npm run build`) and output directory (`dist`).
* Add the **Environment Variable**: `VITE_API_URL` pointing to your Render backend domain URL (e.g., `https://hms-backend.onrender.com`).
* Deployment handles routing fallbacks seamlessly using the pre-configured [**`frontend/vercel.json`**](file:///c:/Users/Vivang%20Mishra/Desktop/HMS/frontend/vercel.json) file.

---
*Developed with excellence by the Medisphere team.*
