# 🌿 FoodFlow Protocol - Beginner's Guide

Welcome to **FoodFlow Protocol**! This is a complete software platform that helps farmers sell directly to citizens, check crop prices, and get AI tips for their crops.

**This guide is written for anyone.** You do not need to be a programmer to run this project. Just follow these steps exactly!

---

## 🛠️ Phase 1: Preparation (Do this once)

Before we start, your computer needs two free tools to run this software: **Node.js** and **Git** make sure to install them.

### Step 1: Install Node.js
1.  Go to this website: [https://nodejs.org/](https://nodejs.org/)
2.  Download the **LTS Version** (Recommended for Most Users).
3.  Run the installer and click "Next" until it finishes.
4.  To check if it worked:
    *   Press `Windows Key + R`
    *   Type `cmd` and hit Enter.
    *   Type `node -v` and hit Enter. You should see a number like `v18.x.x` or `v20.x.x`.

### Step 2: Install Git (Optional but Good)
1.  Go to: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  Download "64-bit Git for Windows Setup".
3.  Install it with default settings.

---

## 🚀 Phase 2: Setting Up the Project

Now let's get the FoodFlow code running on your computer.

### Step 1: Download the Code
If you are reading this on GitHub:
1.  Click the distinct green **Code** button at the top right.
2.  Select **Download ZIP**.
3.  Extract the ZIP folder to your Desktop. Rename the folder to `FoodFlow`.

### Step 2: Open "Terminal"
We will use command lines to start the app. It looks scary, but it's easy!
1.  Open the `FoodFlow` folder you just extracted.
2.  **Right-click** anywhere in empty space inside the folder -> select **"Open in Terminal"** (or "Open PowerShell window here").

### Step 3: Install Backend (The Brain)
Copy and paste these commands one by one into that terminal window. Press Enter after each line:

```bash
cd backend
npm install
```
*Wait for it to finish downloading...*

Now, let's set up the database (where user data is stored):
```bash
npx prisma migrate dev
node prisma/seed.js
```
*You should see a message saying "Seeding finished".*

### Step 4: Install Frontend (The Screen)
Now we need a **second** terminal for the visual part.
1.  Go back to your `FoodFlow` folder in File Explorer.
2.  **Right-click** again -> **"Open in Terminal"**.
3.  Type these commands:
```bash
cd frontend
npm install
```

---

## ▶️ Phase 3: Running the App

### Option A: The Easy Way (One-Click) ⚡
1.  Look for the file named **`start_app.bat`** in the main folder.
2.  Double-click it.
3.  It will automatically open two black windows and start everything for you!

### Option B: The Manual Way
If the script doesn't work, do this manually:

1.  **Start Backend** (Terminal 1):
    ```bash
    cd backend
    npm start
    ```
2.  **Start Frontend** (Terminal 2):
    ```bash
    cd frontend
    npm run dev
    ```
*It will say something like: `Local: http://localhost:5173/`*

### 3. Open in Browser
*   Hold `Ctrl` and click that link (`http://localhost:5173`).
*   Or open Chrome/Edge and type `http://localhost:5173`.

**🎉 Congratulations! You are now running FoodFlow Protocol locally!**

---

## 🧪 Test Accounts (Login Here)

To test the features, use these pre-made accounts:

### 👨‍🌾 To Test Farmer Features
(Selling crops, AI analysis, Weather map)
*   **Email**: `ravi@farmer.com`
*   **Password**: `password123`

### 🛒 To Test Citizen Features
(Buying, Chatting, Viewing Prices)
*   **Email**: `priya@citizen.com`
*   **Password**: `password123`

---

## ❓ Frequently Asked Questions

**Q1: The `npm install` command failed!**
*   Make sure you are connected to the internet.
*   Try restarting your computer and try again.

**Q2: It says "Port already in use"?**
*   This means the app is already running in another window.
*   Find the other black terminal window and close it. Then try again.

**Q3: I see a white screen or error?**
*   Make sure **BOTH** terminal windows (Backend and Frontend) are open and running. If you close the Backend window, the website won't load data.

---

*Need more help? Contact our support team!*
Veeranarayana Gorantla - Linkedin
