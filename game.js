

class game {

    constructor(io) {
        this.io = io;
    }


    startNewGame(room) {
        room.gameStarted = true
        this.io.in(room.name).emit('start', { note: this.createNote(room.gameLevel), users: room.users });
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
                else {

                }
            }
        }
    }

    newRound(room, winner) {
        let responseObjet = {};
        responseObjet.note = this.createNote(room.gameLevel)
        responseObjet.winner = winner
        responseObjet.users = room.users // adding users data to the response for the client
        this.io.in(room.name).emit('roundwinner', responseObjet)
    }

    createNote(gameLevel) {
        let note;
        if (gameLevel === 0) {
            let whiteNotes = [0, 2, 4, 5, 7, 9, 11]
            note = whiteNotes[Math.floor(Math.random() * whiteNotes.length)]
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
            this.io.in(room.name).emit('gamewinner', { winner });
            room.closeRoom()
        }
    }
}

module.exports = game