const chat = require("../Models/chatModel");
const messageModel = require("../Models/messageModel");

let io; // Declare io at the module level

const initializeSocket = (ioInstance) => {
    io = ioInstance;
};

const chats = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await chat.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Emit the new message to the receiver
        if (io) {
            io.emit('newMessage', newMessage);
        }

        res.status(200).json({
            success: true,
            newMessage,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error sending message" });
    }
};

const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await chat.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");
        res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error retrieving messages" });
    }
};

module.exports = { chats, getMessage, initializeSocket };
