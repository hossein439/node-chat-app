const users = [];

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class ActionUser {
    constructor() {}

    addUser({ id, username = "", room = "" }) {
        // Clean the data
        username = username.trim().toLowerCase();
        room = room.trim().toLowerCase();

        // Validate the data
        if (!username || !room) {
            return {
                error: "Username and Room are required!"
            }
        }

        // Check for existing user
        const existingUser = users.find((user) => {
            return user.room === room && user.username === username;
        });

        // Vaildate username
        if (existingUser) {
            return {
                error: "Username is in use!"
            }
        }

        // Store user
        const user = { id, username, room, color: getRandomColor() }
        users.push(user);
        return { user }
    }

    removeUser (id = undefined) {
        const index = users.findIndex((user) => user.id === id);
        if(index !== -1) {
            return users.splice(index, 1)[0];
        }
    }

    getUser (id = undefined) {
        const index = users.find((user) => user.id === id);
        if(!index) {
            return {
                error: "User not found!"
            }
        }
        return index;
    }

    getUserInRoom (room = '') {
        room = room.trim().toLowerCase();
        const usersRoom = users.filter((user) => user.room === room);
        if(!usersRoom) {
            return [];
        }
        return usersRoom;
    } 
}


const user = new ActionUser();
module.exports = { user }