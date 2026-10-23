# 🏥 RHYDHM Physio & Fitness Center Management Portal

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📌 Project Overview

**RHYDHM Physio & Fitness Center Management Portal** is a full-stack, production-ready clinical management system designed for **Dr. Neha Sharma (PT)** — *Senior Physiotherapist & Osteopath (BPT, MPT, IAFT, COMT)*. 

The platform streamlines clinical operations by providing patients with an interactive online appointment booking interface, clinical condition assessment, and self-service consultation history lookup. For the healthcare provider, it offers a secure, PIN-protected **Doctor/Admin Dashboard** equipped with real-time KPI metrics, dynamic appointment filtering, digital prescription and exercise regimen generation, status lifecycle workflows, and automated WhatsApp patient communication.

---

## ✨ Key Features

### 1. 🗓️ Patient Appointment Booking
- **Smart Time-Slot Selection:** Patients can select appointment dates and choose from dynamic 30-minute consultation slots (from `04:00 PM` to `08:00 PM`).
- **Conflict Prevention Engine:** Real-time backend validation prevents double-booking the same time slot on the same date.
- **7 Clinical Specialties:** Dynamic symptom checklists adapt automatically based on the primary clinical issue selected:
  1. *Cervical & Posture Care*
  2. *Spine & Chiropractic Care*
  3. *Paralysis & Neuro Rehab*
  4. *Sports Rehab & Joint Pain*
  5. *Osteopathy & Manual Therapy*
  6. *Advanced Cupping & Needling*
  7. *Home Physiotherapy*
- **Real-Time Booking Feedback:** Instant confirmation alerts with comprehensive booking details.

### 2. 🔍 Patient History & Prescription Lookup
- **Mobile-Based History Search:** Patients can instantly retrieve their prior consultations using their 10-digit mobile number.
- **Prescription & Exercise Access:** Displays previous diagnoses, prescribed rehabilitation exercises, doctor's notes, and scheduled follow-up dates.

### 3. 🩺 Doctor / Admin Dashboard
- **Passcode Protection:** Secure PIN entry gate to restrict access to clinical records.
- **KPI Stat Cards:** Live counter statistics displaying:
  - 📊 *Total Appointments*
  - ⏳ *Pending Action*
  - 📅 *Confirmed / Upcoming*
  - ✅ *Completed (Today & Historical)*
- **Search & Multi-Filter Table:** Filter appointments by status (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) or search instantly by patient name, phone number, or clinical condition.
- **Status Management:** One-click status transitions with database synchronization.
- **Digital Prescription Composer:** Interactive modal for clinicians to input custom exercise routines, diagnostic remarks, and follow-up consultation dates.
- **Instant WhatsApp Communication:** Generates pre-formatted WhatsApp direct messaging links with appointment confirmation and exercise prescription to notify patients instantly.
- **Record Deletion:** Ability to safely delete appointment entries with confirmation prompts.

### 4. 🎨 Theme Support & Internationalization (i18n)
- **Dual Theme Engine:** Smooth toggle between **Light Mode** and **Dark Mode**, persisted in `localStorage` and synchronized with Bootstrap 5 attributes (`data-bs-theme`).
- **Bilingual Localization:** Seamless one-click switching between **English (EN)** and **Hindi (HI - हिन्दी)** across the entire application interface.
- **Responsive Healthcare Aesthetic:** Modern clinical styling with teal color harmony, glassmorphism headers, responsive cards, and Lucide React icons.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Version | Description |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | Component-based UI library with hooks & context state management |
| **Vite** | `^8.2.2` | Next-generation frontend tooling and development server |
| **React Router DOM** | `^7.18.3` | Client-side routing between Landing and Admin portals |
| **Bootstrap** | `^5.3.8` | Responsive grid, utilities, and base component styling |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling with PostCSS integration |
| **Lucide React** | `^1.41.0` | Accessible, modern iconography suite |
| **Axios** | `^1.20.0` | Promise-based HTTP client for REST API communication |

### Backend (`server/`)
| Technology | Version | Description |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.x` | Scalable JavaScript runtime environment |
| **Express** | `^5.2.1` | Minimalist and flexible web framework for RESTful APIs |
| **MongoDB Atlas** | Cloud | Managed cloud NoSQL database cluster |
| **Mongoose** | `^9.9.5` | Elegant MongoDB object modeling and schema validation |
| **CORS** | `^2.8.6` | Middleware enabling secure cross-origin resource sharing |
| **Dotenv** | `^17.4.2` | Zero-dependency environment variable management |
| **JSONWebToken** | `^9.0.3` | Secure token generation for future auth expansions |
| **BcryptJS** | `^3.0.3` | Password hashing utility |
| **Nodemon** | `^3.1.14` | Development live-reload utility |

---

## 📂 Project Structure

```text
ClinicProject/
├── assets/                          # Clinic brochures, certificates & media
│   ├── blogs/
│   ├── certificates/
│   ├── patient_docs/
│   └── final dr neha pt visiting card.pdf
│
├── client/                          # React + Vite Frontend Application
│   ├── public/                      # Static web assets
│   ├── src/
│   │   ├── assets/                  # Frontend graphic assets
│   │   ├── components/              # Modular UI components
│   │   │   ├── BookingForm.jsx      # Interactive patient booking component
│   │   │   ├── Footer.jsx           # Global footer with clinic info & map links
│   │   │   └── Navbar.jsx           # Top navigation with theme/lang toggles
│   │   ├── context/
│   │   │   └── AppContext.jsx       # Theme (Dark/Light) and Language (EN/HI) provider
│   │   ├── data/
│   │   │   ├── clinicData.js        # Clinic timings, doctor profile, conditions & slots
│   │   │   └── translations.js      # Bilingual translation dictionaries (EN/HI)
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx   # Doctor dashboard with KPI stats & prescriptions
│   │   │   └── Home.jsx             # Public landing page, specialties & history lookup
│   │   ├── App.css                  # Custom application styles
│   │   ├── App.jsx                  # Main router configuration
│   │   ├── index.css                # Global CSS variables & teal utility classes
│   │   └── main.jsx                 # Application entry point with AppProvider
│   ├── .env                         # Frontend environment configuration
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Client dependencies & scripts
│   └── vite.config.js               # Vite bundler configuration
│
├── server/                          # Node.js + Express + MongoDB Backend API
│   ├── controllers/                 # Route handler functions
│   │   ├── adminController.js       # Admin CRUD & prescription business logic
│   │   └── appointmentController.js # Appointment booking & availability logic
│   ├── models/                      # Mongoose data schemas
│   │   └── Appointment.js           # Appointment schema with nested session notes
│   ├── routes/                      # Express route endpoints
│   │   ├── adminRoutes.js           # Doctor admin routes
│   │   └── appointmentRoutes.js     # Patient appointment routes
│   ├── .env                         # Backend environment secrets & database URI
│   ├── package.json                 # Server dependencies & scripts
│   └── server.js                    # Express app initialization & MongoDB connection
│
├── .gitignore                       # Git ignore rules for dependencies & env files
└── README.md                        # Project documentation
```

---

## 🚀 Local Setup & Installation Guide

Follow these steps to set up and run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18.x` or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)
- A **MongoDB Atlas** cluster connection string (or a local MongoDB instance running at `mongodb://127.0.0.1:27017/rhythm_clinic`)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/ArjunVashishth07/rhydhm-physio-core.git
cd ClinicProject
```

---

### Step 2: Configure & Start the Backend (`server/`)

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `server/` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rhythm_clinic?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

   | Variable | Description | Default / Example |
   | :--- | :--- | :--- |
   | `PORT` | Port for the Express server to listen on | `5000` |
   | `MONGO_URI` | MongoDB connection URI (Atlas or Local) | `mongodb://127.0.0.1:27017/rhythm_clinic` |
   | `JWT_SECRET` | Secret key used for signing JWT tokens | `your_jwt_secret_key_here` |

4. **Start the backend server:**
   - In Development mode (with live auto-reload):
     ```bash
     npm run dev
     ```
   - In Production mode:
     ```bash
     npm start
     ```

   *The server will start on [http://localhost:5000](http://localhost:5000) with a message confirming `MongoDB Connected Successfully`.*

---

### Step 3: Configure & Start the Frontend (`client/`)

1. **Open a new terminal and navigate to the client directory:**
   ```bash
   cd ../client
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `client/` folder:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

   | Variable | Description | Default |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | Base URL pointing to the running backend Express API | `http://localhost:5000` |

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

   *The client application will be accessible at [http://localhost:5173](http://localhost:5173).*

---

### Step 4: Verification & Access Points

| Portal | URL | Default Credentials / Passcode |
| :--- | :--- | :--- |
| **Patient Portal (Landing Page)** | `http://localhost:5173/` | Public Access |
| **Doctor / Admin Dashboard** | `http://localhost:5173/admin` | Configured via Admin Settings / .env |
| **API Health Check** | `http://localhost:5000/api/health` | Returns `{ "status": "ok" }` |

---

## 📡 API Endpoints Reference

All endpoints are prefixed with `/api`.

### 1. Appointment Endpoints (`/api/appointments`)
Defined in [`server/routes/appointmentRoutes.js`](file:///d:/ClinicProject/server/routes/appointmentRoutes.js):

| Method | Endpoint | Description | Request Body / Query | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Book a new consultation. Validates and prevents double-booking for the selected date & slot. | `{ patientName, phone, age, gender, primaryIssue, symptoms, appointmentDate, timeSlot }` | `201 Created` with saved appointment data |
| `GET` | `/api/appointments/available-slots` | Fetch all open consultation slots for a specific date. | Query: `?date=YYYY-MM-DD` | `200 OK` with `availableSlots: []` |
| `GET` | `/api/appointments/patient-history/:phone` | Lookup past appointment history and prescribed exercises for a patient. | Path Param: `:phone` (or Query: `?phone=`) | `200 OK` with list of past appointments |

### 2. Admin & Doctor Endpoints (`/api/admin`)
Defined in [`server/routes/adminRoutes.js`](file:///d:/ClinicProject/server/routes/adminRoutes.js):

| Method | Endpoint | Description | Request Body / Parameters | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/appointments` | Fetch all appointments sorted in descending chronological order. | None | `200 OK` with array of all appointments & counts |
| `PUT` | `/api/admin/appointments/:id/status` | Update the clinical status of an appointment. | Path: `:id`<br>Body: `{ "status": "Confirmed" }`<br>*(Valid: Pending, Confirmed, Completed, Cancelled)* | `200 OK` with updated appointment record |
| `POST` | `/api/admin/appointments/:id/prescription` | Add or update digital prescription, exercises, and doctor remarks. | Path: `:id`<br>Body: `{ exercisesGiven: [], doctorRemarks: "", nextFollowUp: "" }` | `200 OK` with updated session notes |
| `DELETE` | `/api/admin/appointments/:id` | Permanently remove an appointment record from the database. | Path: `:id` | `200 OK` with deletion status |

### 3. System Health Endpoint
| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server liveness check | `200 OK` `{ status: "ok", message: "RHYDHM Physio API Server Running" }` |

---

## 🏥 Clinic & Practitioner Information

- **Center Name:** RHYDHM Physio & Fitness Center
- **Lead Practitioner:** Dr. Neha Sharma (PT)
- **Qualifications:** BPT, MPT, IAFT, COMT *(Senior Physiotherapist & Osteopath)*
- **Registrations:** MIAP – L40798 | IAFTDL1000 | UPSMF – 3900
- **Clinical Experience:** Ex – Ordnance Factory Hospital, NTPC Hospital, MohanSwaroop Hospital, Dhanwantri Hospital
- **Clinic Address:** H.No. 114, Gali No. 6, New Defence Colony, Near Shiv Mandir, Muradnagar, Ghaziabad – 201206
- **Contact Numbers:** `+91 9760421410` / `+91 9411692044`
- **Clinical Hours:** 4:00 PM – 8:00 PM (Monday to Saturday)

---

## 👨‍💻 Author

**Arjun Vashishth**  
- **GitHub:** [@ArjunVashishth07](https://github.com/ArjunVashishth07)  
- **Project Repository:** [`ArjunVashishth07/rhydhm-physio-core`](https://github.com/ArjunVashishth07/rhydhm-physio-core)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - open for future enhancement and institutional adaptation.
