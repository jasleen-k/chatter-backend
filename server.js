const app = require('./index');
const socket = require('socket.io');
const dbConnect = require('./db');
require('dotenv').config();
const PORT = process.env.PORT;

dbConnect(process.env.MONGO_URI);

const server = app.listen(PORT, () =>
  console.log(`Server is listening on Port ${PORT}`)
);

server.prependListener("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const io = socket(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST"]
  },
  allowEIO3: true,
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieved', data.message);
    }
  });
});