const uniqid = require('uniqid');

class Room {
    constructor(gameLevel = 0) {
        this.users = []
        this.sockets = [];
        this.lockRoom = false;
        this.name = uniqid()
        this.players = 2
        this.gameLevel = gameLevel
        this.answers = 0
        this.gameOver = false
        this.pointsLimit = 100
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

    joinRoom(socket, user) {
        // Join the room
        this.users.push(user)
        this.sockets.push(socket)
        socket.join(this.name)
    }

    async kickUser(socketKick, userKick) {
        let userI = await this.users.find((user, i) => {
            if (user === userKick)
                return i

        })

        let socketI = await this.sockets.find((socket, i) => {
            if (socket === socketKick)
                return i

        })

        this.users.pop(userI)
        this.sockets.pop(socketI)

    }

}

module.exports = Room