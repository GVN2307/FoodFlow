# 🚀 How to Host FoodFlow Protocol Online

Since this is a Hackathon project, we will use free services to host it easily.

-   **Frontend (The Website)**: Hosted on **Vercel** (Free, Fast).
-   **Backend (The Server)**: Hosted on **Render** (Free).
-   **Database**: SQLite (File-based, simpler for now, but resets on redeploy).

---

## Part 1: Host the Backend (API)

1.  **Sign Up on Render**: Go to [https://render.com/](https://render.com/) and login with GitHub.
2.  **Create New Web Service**:
    *   Click "New" -> **"Web Service"**.
    *   Select your GitHub repository (`FoodFlow`).
3.  **Configure Settings**:
    *   **Name**: `foodflow-backend` (or unique name).
    *   **Root Directory**: `backend` (Important!).
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   Click "Advanced" or "Environment".
    *   Add Key: `DATABASE_URL` | Value: `file:./prod.db` (Just to be safe).
    *   Add Key: `JWT_SECRET` | Value: `supersecretkey123`.
5.  **Deploy**: Click "Create Web Service".
    *   Wait for it to finish.
    *   Copy the URL it gives you (e.g., `https://foodflow-backend.onrender.com`). **Save this!**

---

## Part 2: Host the Frontend (UI)

1.  **Sign Up on Vercel**: Go to [https://vercel.com/](https://vercel.com/) and login with GitHub.
2.  **Add New Project**:
    *   Click "Add New..." -> "Project".
    *   Select your GitHub repository (`FoodFlow`).
3.  **Configure Settings**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework**: It should auto-detect "Vite".
4.  **Environment Variables**:
    *   Click "Environment Variables".
    *   **Key**: `VITE_API_URL`
    *   **Value**: Paste your Render Backend URL (Example: `https://foodflow-backend.onrender.com`).
    *   *Note: Do NOT add a trailing slash `/` at the end.*
5.  **Deploy**: Click "Deploy".
    *   Wait about 1 minute.
    *   **Success!** You will get a live URL (e.g., `https://foodflow-frontend.vercel.app`).

---

## ⚠️ Important Note About Database

Since we are using **SQLite** (a simple file database) for simplicity:
*   **Data Persistence**: Be aware that on free hosting like Render, **the database might reset** every time you redeploy the backend.
*   **For Hackathons**: This is usually fine! Just run the "Seed" logic (`node prisma/seed.js`) or manually create account again if it resets.
*   **For Production**: In a real startup, we would connect this to a cloud database like **Neon (PostgreSQL)** or **Supabase**.

---

**That's it! Your project is now live on the internet! 🌍**
