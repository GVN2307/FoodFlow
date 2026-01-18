# FoodFlow Protocol 🌿

**FoodFlow Protocol** is a full-stack platform designed to revolutionize agriculture by creating a direct, transparent, and demand-driven ecosystem. It empowers farmers with AI tools, connects them directly to citizens via a commission-free marketplace, and ensures seamless communication.

## 🚀 Features

### **For Farmers** 👩‍🌾
*   **Smart Dashboard**: Real-time insights on **Crop Trends**, global prices, and active listings.
*   **AI Agronomist 🤖**: Instant crop disease diagnosis using **Gemini Vision** (or smart simulation). Upload an image like `tomato_blight.jpg` for instant advice.
*   **Weather Intelligence 🌦️**: Live weather forecasts integrated with Open-Meteo.
*   **Policy Engine 📜**: Access tailored government schemes (e.g., PM Kisan, Rythu Bandhu).
*   **Product Management**: List produce directly for sale.

### **For Citizens** 🛒
*   **Farm-to-Table Marketplace**: Buy fresh produce directly from growers with **zero middlemen**.
*   **Interactive Shopping Cart**: Add items, manage bill, and simulate secure checkout.
*   **Farmer Directory**: Browse profiles of local farmers to know exactly who grows your food.
*   **Secure Chat 💬**: **End-to-End Encrypted Private Messaging** to chat directly with farmers before buying.

## 🛠️ Technical Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express.
*   **Database**: SQLite (managed via Prisma ORM).
*   **Authentication**: Secure JWT (JSON Web Tokens) & Bcrypt password hashing.
*   **AI Integration**: Google Generative AI (Gemini 1.5 Flash).

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)

### 1. Backend Service
```bash
cd backend
npm install

# Initialize Database
npx prisma migrate dev
node prisma/seed.js  # Seeds Users, Products, Polices

# Start Server (Port 8001)
node index.js
```

### 2. Frontend Application
```bash
cd frontend
npm install

# Start Client (Port 5173 or 5174/5175 if busy)
npm run dev
```

---

## 🔑 Test Accounts

| Persona | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Ravi (Farmer)** | `ravi@farmer.com` | `password123` | Access to Dashboard, Selling, AI |
| **Priya (Citizen)** | `priya@citizen.com` | `password123` | Access to Buying, Cart, Chat |

---

## 🧪 Key Workflows to Try

1.  **AI Diagnosis**: Log in as Farmer -> AI Analyst -> Upload a crop image.
2.  **Order Flow**: Log in as Citizen -> Add items to Cart -> Checkout.
3.  **Private Chat**: Log in as Citizen -> Market/Farmers -> Click "Message Farmer".

## ⚙️ Configuration
Create a `.env` file in `backend/` for advanced features:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
GEMINI_API_KEY="your_google_ai_key" # Optional (App works without it)
```

---
*Built for HackforEarth 2026*
