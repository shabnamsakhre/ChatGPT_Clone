const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');
const aiService = require('../services/ai.service');
const { createMemory, queryMemory } = require('../services/vector.service');

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    // Socket Middleware
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Unauthorized user... Login first!"))
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Unauthorized user... Login first! JWT"))
        }
    })

    io.on('connection', (socket) => {
        socket.on('ai-message', async (messagePayload) => {

            /* 
                const message = await messageModel.create({
                    user: socket.user._id,
                    chat: messagePayload.chat,
                    content: messagePayload.content,
                    role: 'user'
                })

                const vector = await aiService.generateVector(messagePayload.content)
            */

            const [message, vector] = await Promise.all([
                // Create message in messageModel - user
                messageModel.create({
                    user: socket.user._id,
                    chat: messagePayload.chat,
                    content: messagePayload.content,
                    role: 'user'
                }),

                // Generate vector of user entered content
                aiService.generateVector(messagePayload.content)
            ])

            // Create the memory in Pinecode - vector DB
            await createMemory({
                vectors: vector,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                },
                messageId: message._id
            })

            // Fetch the chathistory
            /*
            const chatHistory = await messageModel.find({
                chat: messagePayload.chat
                }) 
                */

            /**
                const memory = await queryMemory({
                    queryVector: vector,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                })

                // How many messages does AI recognize - here last 20 messages
                const chatHistory = (await messageModel.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(20).lean()).reverse();
            */

            const [memory, chatHistory] = await Promise.all([
                // Query into Pinecode memory - Look for the older chat is present on current chat or not.
                queryMemory({
                    queryVector: vector,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),

                // Fetch the last chat history
                messageModel.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `These are some previous message from the chat, use them to generate response
                            ${memory.map(item => item.metadata.text).join('\n')}
                        `
                    }]
                }
            ]

            const response = await aiService.generateResponse([...ltm, ...stm])

            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

            /*
                const responseMessage = await messageModel.create({
                    user: socket.user._id,
                    chat: messagePayload.chat,
                    content: response,
                    role: "model"
                })

                const responseVector = await aiService.generateVector(response)
            */

            const [responseMessage, responseVector] = await Promise.all([
                // Create message in messageModel - model
                messageModel.create({
                    user: socket.user._id,
                    chat: messagePayload.chat,
                    content: response,
                    role: "model"
                }),

                // Generate the vector for AI response
                aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVector,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                },
                messageId: responseMessage._id
            })
        })
    })
}

module.exports = initSocketServer;