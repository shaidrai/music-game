const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const game = require('./game')
const staticDir = path.join(__dirname, 'public')
const Room = require('./room')

const app = express()
app.use(express.static(staticDir))
app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));




const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000


let availbleRoom = [undefined, undefined, undefined] // Level one, two and three.
let PrivateRooms = []
let Game = new game(io)

io.on('connection', (socket) => {
    socket.on('join', (user) => {

        user.id = uniqid()
        user.points = 0
        socket.emit('id', user.id)
        let room;



        if (availbleRoom[user.difficulty]) {
            console.log("existing room")
            // odd player, joining existing room
            room = availbleRoom[user.difficulty]
            availbleRoom[user.difficulty] = undefined
            room.joinRoom(socket, user)
            Game.startNewGame(room, io)
        }
        else {
            console.log("new room")
            // even player, creating new room
            room = new Room(user.difficulty)
            availbleRoom[user.difficulty] = room
            room.joinRoom(socket, user)

        }


        socket.on("answer", (type) => {
            Game.answer(room, type, user)

        })

        socket.on("disconnect", () => {
            // if user leave on loading, the room should be deleted 
            if (!room.gameStarted) availbleRoom[user.difficulty] = undefined

            room.disconnectedUsers += 1
            if (room.disconnectedUsers === room.players - 1) {
                io.in(room.name).emit("left")
            }

        })

    })




    // ***** Private Room!

    socket.on('createPrivateRoom', (data) => {
        socket.removeAllListeners()
        let user = data.user
        console.log("new private room")

        // Sending unique ID to the client and initialize new user
        user.id = uniqid()
        socket.emit('id', user.id)
        user.points = 0

        // New room
        let room = new Room(user.difficulty)
        let roomIndex = PrivateRooms.push(room) - 1

        // Joining the room
        room.joinRoom(socket, user)

        // Sending room name to the admin
        socket.emit("roomName", room.name)

        // 
        socket.on("disconnect", () => {
            console.log("dissconnect")

            // if user leaves before the game started, the room should be deleted 
            if (!room.gameStarted) {

                io.in(room.name).emit("roomClosed")
                PrivateRooms.pop(roomIndex)

            }
            else {
                room.disconnectedUsers += 1
                if (room.disconnectedUsers === room.players - 1) {
                    io.in(room.name).emit("left")
                    PrivateRooms.pop(roomIndex)
                }
            }



        })

        socket.on('deleteRoom', () => {
            io.in(room.name).emit("roomClosed")
            PrivateRooms.pop(roomIndex)
        })


        socket.on("answer", (type) => {
            Game.answer(room, type, user)

        })

        socket.on('startPrivateGame', () => {

            if (room.users.length > 1) {
                io.in(room.name).emit("goToGame")

                console.log("starting")
                Game.startNewGame(room, io)

            }
            else console.log("Not enought players")
        })


    })

    socket.on('joinPrivateRoom', (data) => {
        let user = data.user
        let roomName = data.roomName


        // Sending unique ID to the client
        user.id = uniqid()
        socket.emit('id', user.id)

        user.points = 0

        let room = PrivateRooms.find((room) => {
            if (room.name == roomName) {
                console.log("room founded")
                return room
            }
        })



        if (room) {

            console.log("Joined successfully")
            room.joinRoom(socket, user)
            io.in(room.name).emit("join", room.users)
            console.log(room.users)

            socket.on("answer", (type) => {
                Game.answer(room, type, user)

            })


            socket.on("disconnect", () => {

                if (!room.gameStarted) {
                    console.log("user left room")

                    room.kickUser(socket, user)
                    console.log(room.users)
                    io.in(room.name).emit("left", user)
                }
                else {
                    room.disconnectedUsers += 1
                    if (room.disconnectedUsers === room.players - 1) {
                        io.in(room.name).emit("left")
                    }
                }

            })

        }
        else {
            socket.emit("roomNotExist")
        }





    }) // End of private room


})



// socket.on("rematch", () => {
//     console.log("rematch")

//     findRoomByName(users[userId].room, rooms).then((room) => {
//         if (room.rematch) {
//             cleanRoomPoints(room)
//             io.in(rooms[room].name).emit('start', { note: Math.floor(Math.random() * 12) });
//         }
//         else {
//             io.in(room.name).emit("rematch")
//             room.rematch = true
//         }

//     })

// })


// after joining a room
// socket.on("disconnect", () => {
//     console.log("disconnet")

//     findRoomByName(users[userId].room, rooms).then((room) => {


//         io.in(room.name).emit("left")
//         rooms.splice(rooms.indexOf(room), 1);
//     })

// })




app.get('', (req, res) => {
    res.sendFile('index')
})

server.listen(port, () => {
    console.log("Server is up")
})




