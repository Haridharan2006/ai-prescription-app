# 🏥 BEL Hospital AI Prescription Management System

An AI-powered healthcare application developed for BEL Hospital that converts doctor-patient consultations into structured digital prescriptions using speech recognition and artificial intelligence.

The system captures the doctor's consultation through voice, generates a professional prescription using AI, stores records in MongoDB Atlas, and exports hospital-branded PDF prescriptions.

---

# 🚀 Features

## 👨‍⚕️ Doctor Authentication

* Secure doctor login system
* Doctor ID-based authentication
* Doctor details automatically added to prescriptions
* Logout functionality
* MongoDB-backed doctor management

---

## 🎤 Live Voice Transcription

* Real-time speech-to-text conversion
* Continuous consultation recording
* Live transcript display
* Automatic transcript updates during consultation

---

## 🤖 AI Prescription Generation

Uses Groq LLM to automatically extract:

* Symptoms
* Diagnosis
* Medicines
* Dosage
* Duration
* Instructions (Before Food / After Food)
* Advice

---

## 🩺 Patient Vitals Management

Supports recording:

* Temperature
* Oxygen Saturation
* Blood Pressure
* Pulse Rate

Vitals are displayed on:

* Application Dashboard
* Generated Prescription PDF

---

## 💊 Advanced Medicine Management

Each medicine supports:

| Medicine Name | Dosage | Duration | Instruction |
| ------------- | ------ | -------- | ----------- |
| Dolo 650      | 1-0-1  | 5 Days   | After Food  |

Features:

* Add medicines dynamically
* Remove medicines
* Edit medicine details
* AI extraction from doctor speech

---

## 📄 Professional PDF Prescription

Generated PDF includes:

* BEL Hospital Logo
* Hospital Branding
* Prescription ID
* Date
* Patient Details
* Doctor Details
* Patient Vitals Table
* Symptoms
* Diagnosis
* Medicines Table
* Advice Section
* Doctor Signature Area
* Multi-page Support

---

## ☁️ Cloud Database

MongoDB Atlas Integration:

* Doctor records
* Prescription records
* Cloud-based storage
* Accessible from multiple devices

---

## ⚡ One-Click Startup

The project includes:

* Windows Startup Script (`start.bat`)
* Linux/macOS Startup Script (`start.sh`)

These scripts automatically launch:

* Backend Server
* Frontend Server

making demonstrations and deployment easier.

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Web Speech API
* jsPDF
* html2canvas

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

---

## AI

* Groq API

---

# 📂 Project Structure

```text
ai-prescription-app
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   │   └── bel-logo.png
│   │   │
│   │   ├── components
│   │   │   └── SpeechRecorder.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── models
│   │   ├── Doctor.js
│   │   └── Prescription.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── prescriptionRoutes.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── start.bat
├── start.sh
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-prescription-app.git
```

```bash
cd ai-prescription-app
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING

GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

# ▶️ Running the Application

## Option 1: One-Click Startup (Recommended)

### Windows

Double-click:

```text
start.bat
```

or run:

```bash
start.bat
```

---

### Linux / macOS

Make executable:

```bash
chmod +x start.sh
```

Run:

```bash
./start.sh
```

---

## Option 2: Manual Startup

### Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 👨‍⚕️ Sample Doctor Accounts

## Doctor 1

```text
Doctor ID : BEL001
Password  : 1234
```

### Dr. Rajesh Kumar

General Medicine

---

## Doctor 2

```text
Doctor ID : BEL002
Password  : 1234
```

### Dr. Priya Sharma

Cardiology

---

## Doctor 3

```text
Doctor ID : BEL003
Password  : 1234
```

### Dr. Arun Nair

Orthopedics

---

# 🎙️ Example Consultation

```text
Patient has fever and cough.

Temperature 98.6
Blood pressure 120 over 80
Pulse rate 72
Oxygen saturation 99

Diagnosis viral fever.

Prescribe Dolo 650,
one tablet three times daily,
for 5 days,
after food.

Advice:
Take rest and drink plenty of water.
```

---

# 📄 Generated Prescription Includes

✅ BEL Hospital Branding

✅ Hospital Logo

✅ Prescription Number

✅ Date

✅ Doctor Name

✅ Doctor ID

✅ Patient Information

✅ Patient Vitals

✅ Symptoms

✅ Diagnosis

✅ Medicines Table

✅ Advice

✅ Signature Section

✅ Multi-page Support

---

# ☁️ MongoDB Atlas Setup

1. Create MongoDB Atlas Cluster
2. Create Database User
3. Add Network Access
4. Copy Connection String
5. Add Connection String to `.env`

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

---

# 🔮 Future Enhancements

* Prescription History
* Patient Search
* Voice-Based Vital Extraction
* Appointment Scheduling
* Doctor Dashboard Analytics
* Multi-Doctor Management
* Electronic Medical Records (EMR)
* Online Deployment

---


# 👨‍💻 Developed By

Haridharan B S

Internship Project

AI Prescription Management System

---

# 📜 License

This project is developed for educational, internship, and demonstration purposes.
