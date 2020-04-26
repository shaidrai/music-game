
const uniqid = require('uniqid');
const Room = require('./room')
const game = require('./game')
const Bot = require('./bot/bot')

function SocketHandler(io) {

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
                const bot = new Bot(user.difficulty, user.rank)
                bot.useBotOnTimeout(room)
                room.bot = bot

            }

            socket.on("answer", (type) => {

                Game.answer(room, type, user)

            })

            socket.on("disconnect", () => {
                console.log("dissconnect")
                // if user leave on loading, the room should be deleted 
                if (!room.gameStarted) {
                    availbleRoom[user.difficulty] = undefined
                    if (room.bot) {
                        console.log("cleared")
                        clearTimeout(room.bot.startingTimeout)
                    }
                }

                else if (!room.gameOver) {

                    room.disconnectedUsers += 1
                    if (room.disconnectedUsers === room.players - 1) {
                        io.in(room.name).emit("left")
                        room.closeRoom()
                    }

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
            room.roomIndex = PrivateRooms.push(room) - 1

            // Joining the room
            room.joinRoom(socket, user)

            // Sending room name to the admin
            socket.emit("roomName", room.name)

            // 
            socket.on("disconnect", () => {
                console.log("dissconnect")

                // if user leaves before the game started, the room should be deleted 
                if (!room.gameStarted) {


                    room.kickUser(socket, user)
                    console.log('admin left')
                    io.in(room.name).emit("roomClosed")
                    PrivateRooms.pop(room.roomIndex)



                }
                /// Else check if the room is more then 2 players, if it is kick user, else close room
                else {
                    room.disconnectedUsers += 1
                    if (room.disconnectedUsers === room.players - 1) {
                        io.in(room.name).emit("left")
                        room.closeRoom()
                        PrivateRooms.pop(room.roomIndex)
                    }
                    else {
                        room.kickUser(socket, user)
                    }
                }



            })

            socket.on('deleteRoom', () => {
                io.in(room.name).emit("roomClosed")
                PrivateRooms.pop(room.roomIndex)
            })


            socket.on("answer", (type) => {
                Game.answer(room, type, user)

            })

            // Start private game button at client 
            socket.on('startPrivateGame', () => {

                // Checking if there's more then 1 player to start the game
                if (room.users.length > 1) {

                    // Event tell all the clients in the room to go game component
                    io.in(room.name).emit("goToGame")

                    // Changing the game mode to the count of players in room
                    room.players = room.users.length

                    // Starting the game
                    console.log("starting")
                    Game.startNewGame(room, io)

                }
                // Not 
                else console.log("Not enought players")
            })


        })

        socket.on('joinPrivateRoom', (data) => {
            console.log("joinnnn")
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



            if (room && room.users.length < 3) {

                console.log("room successfully")
                room.joinRoom(socket, user)
                io.in(room.name).emit("join", room.users)


                socket.on("answer", (type) => {
                    Game.answer(room, type, user)

                })


                socket.on("disconnect", () => {

                    if (!room.gameStarted) {
                        console.log("user left room")
                        room.kickUser(socket, user)
                        io.in(room.name).emit("left", user)
                    }
                    else {
                        room.disconnectedUsers += 1
                        if (room.disconnectedUsers === room.players - 1) {
                            io.in(room.name).emit("left")
                            room.closeRoom()
                            PrivateRooms.pop(room.roomIndex)
                        }
                        else {
                            room.kickUser(socket, user)
                        }
                    }

                })

            }

            else if (room) socket.emit("joinErrorMessage", "Room is full")

            else {
                socket.emit("joinErrorMessage", "Room doesn't exist")
            }





        }) // End of private room
    })
}

module.exports = SocketHandler