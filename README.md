# iinSpark API

## 🚀 Overview
This is the backend for the iinSpark application, built with **Node.js**, **Express.js**, and **MongoDB**. It provides APIs for user authentication, product management, leaderboard, and profile updates.

---

## 📌 Features
- **User Authentication** (Sign-up, Sign-in, Token-based Auth)
- **User Management** (Profile, Coins, Levels, Grades)
- **Product Management** (Fetching, Buying)
- **Leaderboard System** (Points, Ranking)
- **Video & Content Fetching**

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Hosting:** Render (Optional: Vercel for frontend)

---

## 📂 Project Structure
```
📦 iinSpark
 ┣ 📂 config        # Database and config settings
 ┣ 📂 controllers   # Route logic
 ┣ 📂 models        # Mongoose schemas
 ┣ 📂 routes        # API endpoints
 ┣ 📜 server.js     # Main entry point
 ┣ 📜 .env.example  # Sample environment variables
```

---

## 🏗️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/SACHINBODARE07/IInspark.git
cd iinspark
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Create `.env` File
Copy `.env.example` to `.env` and configure your environment variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Run the Server
```sh
npm start
```
The server will run on `http://localhost:5000/`

---

## 🚀 API Endpoints
### 🔹 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/signin` | User login |
| GET | `/api/users/getUserData` | Fetch user data |

### 🔹 Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products/buy` | Purchase a product |

### 🔹 Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/updateLeaderboard` | Update leaderboard score |
| GET | `/api/users/getLeaderboard` | Fetch leaderboard data |

### 🔹 User Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/updateCoins` | Update user coins |
| POST | `/api/users/updateProfileLevel` | Update user level |
| GET | `/api/users/getUserGrade` | Fetch user grade |

---

## 🌍 Deployment on Render
1. **Create a new web service** on [Render](https://render.com/)
2. **Connect GitHub Repository**
3. Set Environment Variables from `.env`
4. Start the build process

---

## 🌍 (Optional) Deploying Frontend on Vercel
1. Install [Vercel CLI](https://vercel.com/docs/cli)
```sh
npm install -g vercel
```
2. Deploy project
```sh
vercel
```
3. Follow on-screen instructions

---

## ❓ Common Issues & Fixes
**1. MongoDB Connection Error**  
Make sure your `MONGO_URI` is correctly set in `.env` and your database is accessible.

**2. JWT Authentication Failure**  
Ensure `JWT_SECRET` is correctly configured and matches in frontend & backend.

**3. API Not Working on Render**  
Check logs in Render dashboard and update `CORS` settings.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contribution
Feel free to submit issues, PRs, and feature requests!
