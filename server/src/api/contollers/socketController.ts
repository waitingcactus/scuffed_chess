var users = []
function generateRoomId() {
    var result = "";
    const length = 16;
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@";

    for (var i = 0; i < length; i++) 
        result += possible.charAt(Math.floor(Math.random() * possible.length))

    return result;
}

// socket io listen to connection
export default function socketController(io: any) {
    io.on('connection', function(socket) {
        console.log("New connection from " + socket.id)

        socket.on("joinRoom", joinRoom);

        socket.on("sendName", sendName);
    
        socket.on("disconnect", disconnect);
    
        socket.on("move", move);

        socket.on("sendJoinRequest", sendJoinRequest);

        socket.on("joinRequestAnswer", joinRequestAnswer);

        function roomList() {
            setTimeout(() => io.emit("roomsList", users.map((user) => (user.ownRoom) && user.name)), 200);
        }

        function joinRoom(room) {
            console.log(`User with ID: ${socket.id} joined room: ${room}`)
            socket.join(room)
            const user = users.filter(user=>user.id == socket.id)[0];
            user.room = room;
            user.ownRoom = false;
            roomList();
        }

        async function sendName(name) {
            var isNameValid = true;
            for (var i = 0; i < users.length; i++) {
                if(users[i].name === name) {
                    isNameValid = false;
                    socket.emit('nameError', 'Name is already in use, please try a different one.')
                    return;
                }
            }
            if(isNameValid) {
                const room = generateRoomId();
                users.push({id: socket.id, name: name, room: room, ownRoom: true});
                socket.join(room);
                console.log(`User with name: ${name} joined room: ${room}`)
                socket.emit("roomId", room);
                
                roomList();
            }
        }

        function disconnect() {
            console.log("User Disconnected", socket.id)
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == socket.id) {
                    socket.broadcast.to(users[i].room).emit("opponentDisconnect");
                    users.splice(i, 1);
                    roomList();
                    break;
                }
            }
        }

        function move(data) {
            socket.broadcast.to(data.room).emit("broadcastMove", data)
        }

        function sendJoinRequest([sendingUser, receivingUser]) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].name === receivingUser) {
                    socket.broadcast.to(users[i].room).emit("sendJoinRequest", sendingUser)
                }
            }
            
        }

        function joinRequestAnswer(answer, sendingUser) {
            var user = users.filter(user => user.id == socket.id)[0]
            var socketId = users.filter(user => user.name == sendingUser)[0].id

            if (answer) {
                socket.to(socketId).emit("joinRoom", user.room, user.name);
            } else {
                socket.to(socketId).emit("joinRequestDeclined", user.name);
            }
        }
        
    })
}