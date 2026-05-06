import admin, { db } from "../lib/firebase.js";

export const getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userDoc = await db.collection("users").doc(id).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        await db.collection("users").doc(id).delete();
        await admin.auth().deleteUser(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};