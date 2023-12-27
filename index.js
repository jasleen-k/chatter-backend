const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;