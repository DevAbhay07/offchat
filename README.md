# 💬 OffChat — Real-Time Chat App

A full-stack real-time chat application built with **React**, **Node.js/Express**, **Firebase** (Auth + Firestore), **Socket.io**, and **Cloudinary**.

> 👑 Admins can view and manage all users from a dedicated dashboard.  
> 💬 Users can chat, share images, and see who's online in real time.

---

## 🚀 Features

### 👤 Authentication (Firebase)
- Sign up and log in securely via **Firebase Authentication**
- Firebase ID tokens verified on every API request
- No passwords stored on the server

### 🔐 Role-Based Authorization
- Supports `user` and `admin` roles stored in Firestore
- Admin routes protected on both frontend and backend
- Admin-only "Users" tab in navbar

### 💬 Real-Time Chat (Socket.io)
- Send and receive messages instantly
- Share images in chat (uploaded via Cloudinary)
- See which users are currently online
- 1-on-1 conversations with all registered users
- Messages delivered via Socket.io only to the active conversation

### 🛠️ Admin Panel
- View all registered users
- Delete any user (removed from Firestore + Firebase Auth)

### 🎨 UI
- 30+ themes powered by DaisyUI
- Fully responsive — works on mobile and desktop
- Skeleton loaders, toast notifications, live profile updates

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Zustand, TailwindCSS, DaisyUI |
| **Backend** | Node.js, Express.js |
| **Auth** | Firebase Authentication |
| **Database** | Firestore (Firebase) |
| **Real-time** | Socket.io |
| **Media Uploads** | Cloudinary |

---

## 🛠️ Installation & Running Locally

### 1. Clone the repo
```bash
git clone https://github.com/DevAbhay07/offchat.git
cd offchat
```

### 2. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Create `backend/.env`
```env
PORT=5001
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Get Firebase Admin credentials from **Firebase Console → Project Settings → Service Accounts → Generate new private key**

### 4. Configure Firebase (Frontend)
Update `frontend/src/lib/firebase.js` with your Firebase project config from **Firebase Console → Project Settings → Your Apps**.

### 5. Start the app
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:3000**

---

## 🧪 Demo

Sign up with any email to get started. To create an admin account, manually set `role: "admin"` on the user document in **Firestore Console**.

---

## 📁 Project Structure

```
offchat/
├── backend/
│   ├── src/
│   │   ├── controllers/     # auth, messages, admin
│   │   ├── lib/             # firebase, cloudinary, socket
│   │   ├── middleware/      # protectRoute, verifyToken, adminOnly
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/           # Zustand stores
│   │   └── lib/             # axios, firebase
│   └── package.json
└── package.json
```

---

*Built by [DevAbhay07](https://github.com/DevAbhay07)*




