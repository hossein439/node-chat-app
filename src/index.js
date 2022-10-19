const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const filterWords = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages.js');
const { user: userAction } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000 || process.env.PORT;
const publicPathDirectory = path.join(__dirname, '../public');
app.use(express.static(publicPathDirectory));

const badWords = new filterWords();
badWords.addWords('hooker');


io.on('connection', (socket) => {

    console.log('New Connection');

    socket.on('join', (options, callback) => {
        const { user, error } = userAction.addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'), '#ccc');
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`), user.color);

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: userAction.getUserInRoom(user.room),
        });

        callback()
    });

    socket.on('sendMessage', (message, callback) => {
        if (badWords.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }

        if (message.trim() === '' || message === null) {
            return callback();
        }

        const user = userAction.getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message), user.color);
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = userAction.getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`), user.color);

        callback();
    });

    socket.on('disconnect', () => {
        const user = userAction.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`), '#ccc');
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: userAction.getUserInRoom(user.room),
            });
        }
    });
})

server.listen(port, () => {
    console.log(`Server is up on ${port}`)
});