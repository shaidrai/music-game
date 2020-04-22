const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser');
const staticDir = path.join(__dirname, 'public')
const SocketHandler = require('./socket')

const app = express()
//app.use(express.static(staticDir))
app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 5000
SocketHandler(io)


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



app.get('/', (req, res) => {

    if (req.query.roomName) {
        console.log(req.query.roomName)
        res.redirect("doremi://test?roomName=" + req.query.roomName)
    }
    else {
        res.send("index")
    }
})

server.listen(port, () => {
    console.log("Server is up")
})




