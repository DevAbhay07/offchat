import { db } from "../lib/firebase.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email } = req.body;
    const userId = req.user._id;
    try {
        if (!fullName || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await db.collection("users").doc(userId).get();
        if (existing.exists) {
            return res.status(200).json({ _id: userId, ...existing.data() });
        }

        const newUser = {
            _id: userId,
            fullName,
            email,
            profilePic: "",
            role: "user",
            createdAt: new Date().toISOString(),
        };

        await db.collection("users").doc(userId).set(newUser);
        res.status(201).json(newUser);
    } catch (err) {
        console.log("Error in signup controller:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = (req, res) => {
    res.status(200).json({ message: "Login handled by Firebase on client" });
};

export const logout = (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse || !uploadResponse.secure_url) {
            return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        const userId = req.user._id;
        await db.collection("users").doc(userId).update({ profilePic: uploadResponse.secure_url });

        const updatedUser = { ...req.user, profilePic: uploadResponse.secure_url };
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in updateProfile:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in checkAuth:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};