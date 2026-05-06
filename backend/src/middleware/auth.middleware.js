import admin, { db } from "../lib/firebase.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        const idToken = authHeader.split("Bearer ")[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.user = { _id: decoded.uid, email: decoded.email };
        next();
    } catch (err) {
        console.log("verifyToken error:", err.message);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decoded = await admin.auth().verifyIdToken(idToken);

        const userDoc = await db.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = { _id: decoded.uid, ...userDoc.data() };
        next();
    } catch (err) {
        console.log("protectRoute error:", err.message);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};