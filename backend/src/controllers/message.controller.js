import { db } from "../lib/firebase.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs
            .map(doc => ({ _id: doc.id, ...doc.data() }))
            .filter(user => user._id !== loggedInUser);
        res.status(200).json(users);
    } catch (err) {
        console.log("Error in getUsersForSidebar:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const [sentSnap, receivedSnap] = await Promise.all([
            db.collection("messages").where("senderId", "==", myId).get(),
            db.collection("messages").where("senderId", "==", userToChatId).get(),
        ]);

        const messages = [
            ...sentSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() })).filter(m => m.receiverId === userToChatId),
            ...receivedSnap.docs.map(doc => ({ _id: doc.id, ...doc.data() })).filter(m => m.receiverId === myId),
        ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = {
            senderId,
            receiverId,
            text: text || "",
            image: imageUrl,
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection("messages").add(newMessage);
        const messageWithId = { _id: docRef.id, ...newMessage };

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageWithId);
        }

        res.status(201).json(messageWithId);
    } catch (err) {
        console.log("Error in sendMessage:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

