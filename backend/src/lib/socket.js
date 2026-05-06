import {Server} from "socket.io"
import http from "http";
import express from "express"

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
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
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {} // {userId: socketId}

io.on("connection", (socket)=>{
    console.log("A user connected ", socket.id)

    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id
    // console.log(Object.keys(userSocketMap))

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("A user disconnected ", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})
export {io, server, app}