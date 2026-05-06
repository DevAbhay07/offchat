import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";
import "./lib/firebase.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config(); // Load environment
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();
app.use(express.json({ limit: '20mb' }));

// Increase the limit to 5MB (adjust as needed)
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        const isLocalhost = !origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        const isAllowed = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;
        if (isLocalhost || isAllowed) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});