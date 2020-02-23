const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

const staticDir = path.join(__dirname, 'public')


const app = express()
app.use(express.static(staticDir))
app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

class Room {
    constructor(sockets = [], players = 2, gameLevel = 1) {
        this.users = []
        this.sockets = sockets;
        this.lockRoom = false;
        this.name = uniqid()
        this.players = players
        this.gameLevel = gameLevel
        this.answers = 0
        this.gameOver = false
        this.pointsLimit = 10
        this.disconnectedUsers = 0,
            this.gameStarted = false
    }

    closeRoom() {
        this.sockets.forEach((socket) => {
            socket.disconnect()
        })
    }

    lockThisRoom() {
        this.lockRoom = true
        setTimeout(() => {
            this.lockRoom = false
        }, 2500)
    }


}

class game {


    startNewGame(room) {
        room.gameStarted = true
        io.in(room.name).emit('start', { note: this.createNote(room.gameLevel), RoomUsers: { user1: room.users[0], user2: room.users[1] } });
    }

    answer(room, answerType, user) {

        if (!room.lockRoom) {
            if (answerType === 'correct') {
                // end of round
                room.lockThisRoom()
                user.points += 10 // adding 10 points for correct answer

                if (user.points === room.pointsLimit) {
                    // Gameover
                    this.endGame(room, user.id)
                }

                else {
                    // winner id for the client
                    room.answers = 0
                    this.newRound(room, user.id)
                }
            }
            else {
                room.answers += 1
                if (user.points > 0) user.points -= 10

                if (room.answers === room.players) {
                    // end of round
                    //room.lockThisRoom()
                    room.answers = 0
                    this.newRound(room)
                }
            }
        }
    }

    newRound(room, winner) {
        let responseObjet = {};
        responseObjet.note = this.createNote(room.gameLevel)
        responseObjet.winner = winner
        responseObjet.user1 = room.users[0] // adding users data to the response for the client
        responseObjet.user2 = room.users[1]  // changae that to array later!!
        //responseObjet.users = room.users
        io.in(room.name).emit('roundwinner', responseObjet)

    }

    createNote(gameLevel) {
        let note;
        if (gameLevel === 0) {
            note = Math.floor(Math.random() * 12)
        }
        if (gameLevel === 1) {
            note = Math.floor(Math.random() * 12)
        }
        if (gameLevel === 2) {
            note = Math.floor(Math.random() * 12)
        }
        return note


    }

    endGame(room, winner) {

        if (!room.gameOver) {
            room.gameOver = true
            io.in(room.name).emit('gamewinner', { winner });
            room.closeRoom()
        }
    }
}

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000


let availbleRoom = undefined
let Game = new game()
io.on('connection', (socket) => {
    socket.on('join', (user) => {

        user.id = uniqid()
        user.points = 0

        socket.emit('id', user.id)
        let room;

        if (availbleRoom) {
            console.log("existing room")
            // odd player, joining existing room
            room = availbleRoom
            availbleRoom = undefined
            room.users.push(user)
            room.sockets.push(socket)
            socket.join(room.name)
            Game.startNewGame(room, io)
        }
        else {
            console.log("new room")
            // even player, creating new room
            room = new Room()
            room.users.push(user)
            room.sockets.push(socket)
            availbleRoom = room
            socket.join(room.name)
        }


        socket.on("answer", (type) => {
            Game.answer(room, type, user)

        })

        socket.on("disconnect", () => {
            // if user leave on loading, the room should be deleted 
            if (!room.gameStarted) availbleRoom = undefined

            room.disconnectedUsers += 1
            if (room.disconnectedUsers === room.players - 1) {
                io.in(room.name).emit("left")
            }

        })

    })
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




