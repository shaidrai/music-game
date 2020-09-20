const UserData = require('./updateUsers')

class game {
	constructor(io) {
		this.io = io;
	}

	startNewGame(room) {
		room.gameStarted = true;
		this.io.in(room.name).emit("start", {
			note: this.createNote(room.gameLevel),
			users: room.users,
		});
		this.answerTimer(room, 20000);
	}

	answer(room, answerType, user) {
		if (!room.lockRoom) {
			if (answerType === "correct") {
				// end of round
				room.lockThisRoom();
				user.points += 10; // adding 10 points for correct answer

				if (user.points === room.pointsLimit) {
					// Gameover
					this.endGame(room, user.id);
				} else {
					// winner id for the client
					this.newRound(room, user.id);
				}
			} else {
				room.answers += 1;
				room.usersAnswered.push(user);
				if (user.points > 0) user.points -= 10;

				if (room.answers === room.players) {
					// end of round
					//room.lockThisRoom()

					this.newRound(room);
				} else {
				}
			}
		}
	}

	newRound(room, winner) {
		this.answerTimer(room, 20000);
		room.answers = 0;
		room.usersAnswered = [];
		let responseObjet = {};
		responseObjet.note = this.createNote(room.gameLevel);
		responseObjet.winner = winner;
		responseObjet.users = room.users; // adding users data to the response for the client
		this.io.in(room.name).emit("roundwinner", responseObjet);
	}

	createNote(gameLevel) {
		let note;
		if (gameLevel === 0) {
			let whiteNotes = [0, 2, 4, 5, 7, 9, 11];
			note = whiteNotes[Math.floor(Math.random() * whiteNotes.length)];
		}
		if (gameLevel === 1) {
			note = Math.floor(Math.random() * 12);
		}
		if (gameLevel === 2) {
			note = Math.floor(Math.random() * 12);
		}
		return note;
	}

	endGame(room, winner) {
		clearTimeout(this.answerTimeout);
		if (!room.gameOver) {
			room.gameOver = true;
			this.io.in(room.name).emit("gamewinner", { winner });
			room.closeRoom();
		}
	}

	// Timer for filling the answers, if one client doesnt response after timeout, server kicks him.
	answerTimer(room, time) {
		clearTimeout(this.answerTimeout);
		this.answerTimeout = setTimeout(() => {
			room.users.forEach((user, i) => {
				if (!room.usersAnswered.includes(user)) {
					room.sockets[i].disconnect();
					room.users.pop(i);
					room.sockets.pop(i);
				}
			});
		}, time);
	}
}

module.exports = game;
