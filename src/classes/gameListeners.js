const uniqid = require("uniqid");
const Room = require("./room");
const Game = require("./game");
const Bot = require("../bot/bot");


class GameListeres {
    constructor(io) {
        this.availbleRoom = [undefined, undefined, undefined]; // Level one, two and three.
        this.privateRooms = [];
        this.io = io
        this.game = new Game(io)
        this.manager()
    }


    join() {
        user.id = uniqid();
        user.points = 0;
        socket.emit("id", user.id);

        if (availbleRoom[user.difficulty]) {
            console.log("existing room");
            // odd player, joining existing room
            room = availbleRoom[user.difficulty];
            availbleRoom[user.difficulty] = undefined;
            room.joinRoom(socket, user);
            game.startNewGame(room, io);
        } else {
            console.log("new room");
            // even player, creating new room
            room = new Room(user.difficulty);
            availbleRoom[user.difficulty] = room;
            room.joinRoom(socket, user);
            const bot = new Bot(user.difficulty, user.rank);
            bot.useBotOnTimeout(room);
            room.bot = bot;
        }
    }

    userLeft() {
        console.log("dissconnect");
        // if user leave on loading, the room should be deleted
        if (!room.gameStarted) {
            availbleRoom[user.difficulty] = undefined;
            if (room.bot) {
                console.log("cleared");
                clearTimeout(room.bot.startingTimeout);
            }
        } else if (!room.gameOver) {
            room.disconnectedUsers += 1;
            if (room.disconnectedUsers === room.players - 1) {
                io.in(room.name).emit("left");
                room.closeRoom();
            }
        }
    }

    listeners() {
        this.io.on("connection", (socket) => {
            socket.on("join", (user) => {
                this.join()

                socket.on("answer", (type) => {
                    game.answer(room, type, user);
                });

                socket.on("disconnect", this.userLeft)
            })
        })
    }

    manager() {
        let room;
        this.listeners()
    }
}

module.exports = GameListeres