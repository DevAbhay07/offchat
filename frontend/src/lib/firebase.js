import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7wacvO54_VF4Uq4_ap864999T9f4u1vA",
  authDomain: "offchat-d2e84.firebaseapp.com",
  projectId: "offchat-d2e84",
  storageBucket: "offchat-d2e84.firebasestorage.app",
  messagingSenderId: "303291575137",
  appId: "1:303291575137:web:3f29d9f2b3a81360223320",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
