const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');
const aiService = require('../services/ai.service');
const { createMemory, queryMemory } = require('../services/vector.service');

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

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
        console.log("Connected User: ", socket.user);
        console.log("New socker connection: ", socket.id);

        socket.on('ai-message', async (messagePayload) => {

            const message = await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: messagePayload.content,
                role: 'user'
            })

            // Fetch the chathistory
            /*
                const chatHistory = await messageModel.find({
                    chat: messagePayload.chat
                }) 
            */

            const vector = await aiService.generateVector(messagePayload.chat)

            const memory = await queryMemory({
                queryVector: vector,
                limit: 3,
                metadata: {
                    user: socket.user._id
                }
            })

            await createMemory({
                vectors: vector,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                },
                messageId: message._id
            })

            // How many messages does AI recognize - here last 20 messages
            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse();

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

            console.log(ltm[0]);
            console.log(stm);


            const response = await aiService.generateResponse([...ltm, ...stm])

            const responseMessage = await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: response,
                role: "model"
            })

            const responseVector = await aiService.generateVector(response)

            await createMemory({
                vectors: responseVector,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                },
                messageId: responseMessage._id
            })

            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })
        })
    })
}

module.exports = initSocketServer;