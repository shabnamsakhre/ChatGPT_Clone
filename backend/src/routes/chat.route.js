const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

// POST - Create Chats
router.post('/', authMiddleware.authUser, chatController.createChat);

// GET - Fetch chats
router.get('/', authMiddleware.authUser, chatController.getChats);

// Fetch all the messages
router.get('/messages/:id', authMiddleware.authUser, chatController.getMessages);

module.exports = router;