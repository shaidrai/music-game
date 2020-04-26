const io = require("socket.io-client")
const botConff = require('./configurations')


class Bot {
    constructor(difficulty, rank) {
        this.rank = rank
        this.difficulty = difficulty
        this.socket = io.connect("https://music-game-server.herokuapp.com")
        this.timeouts = []
    }

    join() {
        this.socket.emit('join', botData)
    }

    createBot() {
        botData.difficulty = this.difficulty
        botData.rank = this.rank + botConff.rank[Math.floor(Math.random() * (botConff.rank.length))]
        botData.profilePictureIndex = Math.floor(Math.random() * (9))
        botData.name = botConff.names[Math.floor(Math.random() * (botConff.names.length))]
        this.botLevel = this.getBotLevel(this.rank)
    }

    mannager() {
        this.socket.on("start", () => {
            this.socket.removeEventListener('start')
            this.answer(8000)

            this.socket.on("roundwinner", () => {
                this.clearTimeOuts()
                this.answer(8000)
            });

            this.socket.on("gamewinner", () => {
                this.clearTimeOuts()
                this.socket.disconnect()
            });

            this.socket.on("left", () => {
                this.clearTimeOuts()
                this.socket.disconnect()
            })
        });
    }


    answer(timeout) {
        this.timeouts.push(setTimeout(() => {
            this.socket.emit("answer", botConff[this.botLevel].rightAnswer[Math.floor(Math.random() * (botConff[this.botLevel].rightAnswer.length))])

        }, timeout + botConff[this.botLevel].timeOutsAfterPlaying[Math.floor(Math.random() * (botConff[this.botLevel].timeOutsAfterPlaying.length))]))
    }

    clearTimeOuts() {
        this.timeouts.forEach(timeout => clearTimeout(timeout))
    }

    initialize() {
        this.createBot()
        this.join()
        this.mannager()
    }

    useBotOnTimeout(room) {
        setTimeout(() => {
            if (!room.gameStarted) this.initialize()
        }, botConff.startBotTimeOut[Math.floor(Math.random() * (botConff.startBotTimeOut.length))])
    }

    getBotLevel(rank) {
        let randomLevels = undefined;
        if (rank > 1200) randomLevels = ['best', 'best', 'ok', 'good', 'good', 'best', 'good']
        else if (rank > 1000) randomLevels = ['best', 'good', 'good', 'good', 'ok', 'bad', 'best', 'ok']
        else if (rank <= 800) randomLevels = ['worst', 'bad', 'ok', 'ok', 'bad', 'good']
        else randomLevels = ['best'] //['ok', 'ok', 'ok', 'bad', 'good', 'best']
        return randomLevels[Math.floor(Math.random() * (randomLevels.length))]

    }

}




const botData = {
    name: "botTest",
    notes: 10000,
    rank: 1250,
    games: {
        trainingMode: [{ level: 'EASY', record: 0 }, { level: 'MEDIUM', record: 0 }, { level: 'HARD', record: 0 }],
        onlineMode: { wins: 50, loses: 53 },
        tutorial: {}
    },
    profilePictureIndex: 0,
    difficulty: 0
}

module.exports = Bot