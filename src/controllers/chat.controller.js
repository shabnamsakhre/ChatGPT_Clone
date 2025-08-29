const chatModel = require('../models/chat.model');

async function createChat(req, res) {
    const user = req.user;
    const { title } = req.body;

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        message: "Chat is created sucessfully.",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity
        }
    })
}

module.exports = { createChat }