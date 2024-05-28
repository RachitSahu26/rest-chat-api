const mongoose = require("mongoose");
const chatModel = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
},{timestamps:true});


const chat = mongoose.model("Chat", chatModel);

module.exports = chat;