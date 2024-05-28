const { Server } = require("socket.io");

let socketUsers = {};

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
        },
    });

    io.on("connection", (socket) => {
        console.log('User has connected', socket.id);

        const userId = socket.handshake.query.authId;
        if (userId !== undefined) {
            socketUsers[userId] = socket.id;
            io.emit('getOnlineUsers', Object.keys(socketUsers));
        } else {
            console.warn('authId is not provided, disconnecting socket', socket.id);
            socket.disconnect();
            return;
        }

        socket.on('disconnect', () => {
            const disconnectedUserId = Object.keys(socketUsers).find(key => socketUsers[key] === socket.id);
            if (disconnectedUserId !== undefined) {
                delete socketUsers[disconnectedUserId];
                io.emit('getOnlineUsers', Object.keys(socketUsers));
            }
        });

        socket.on('newMessage', (newMessage) => {
            const receiverSocketId = socketUsers[newMessage.receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }
        });
    });

    return { io };
}

const getReceiverSocketId = (userId) => socketUsers[userId];

module.exports = { setupSocket, getReceiverSocketId };
