import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase.js";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
          } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
          }
        } else {
          set({ authUser: null });
        }
        set({ isCheckingAuth: false });
        resolve();
      });
    });
  },

  signup: async (data, onSuccess) => {
    set({ isSigningUp: true });
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      const res = await axiosInstance.post("/auth/signup", {
        fullName: data.fullName,
        email: data.email,
      });
      set({ authUser: res.data });
      toast.success("Account created successfully");
      if (onSuccess) onSuccess();
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message || "Signup failed");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data, onSuccess) => {
    set({ isLoggingIn: true });
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      if (onSuccess) onSuccess();
      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io("/", {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));