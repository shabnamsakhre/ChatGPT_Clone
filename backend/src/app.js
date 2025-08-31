const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const chatRoutes = require('./routes/chat.route');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;