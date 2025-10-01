const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');

// Create Chat
async function createChat(req, res) {
    const user = req.user;
    const { title } = req.body;

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        message: "New Chat is created sucessfully.",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity
        }
    })
}

// Fetch Chats
async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user._id });

    res.status(200).json({
        message: "Chats retrived succesfully!",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    })
}

// Fetch all the messages
async function getMessages(req, res) {
    const chatId = req.params.id;

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrived succesfully.",
        messages: messages
    })
}

module.exports = { createChat, getChats, getMessages }