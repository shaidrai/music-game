const io = require("socket.io-client")
const botConff = require('./configurations')


class Bot {
    constructor(difficulty, rank) {
        this.rank = rank
        this.difficulty = difficulty
        this.socket = io.connect(botConff.endpoint)
        this.timeouts = []
    }

    join() {
        this.socket.emit('join', botData)
    }

    createBot() {
        botData.difficulty = this.difficulty
        botData.profilePictureIndex = Math.floor(Math.random() * (9))
        botData.name = (botConff.names[Math.floor(Math.random() * (botConff.names.length))]).toUpperCase()
        this.botLevel = this.getBotLevel(this.rank)



        let min = botConff.rank[this.botLevel].min
        let max = botConff.rank[this.botLevel].max
        let delta = max - min
        botData.rank = Math.floor(Math.random() * delta) + min

    }

    mannager() {
        this.socket.on("start", () => {
            this.socket.removeEventListener('start')
            this.answer(6900)

            this.socket.on("roundwinner", () => {
                this.clearTimeOuts()
                this.answer(6800)
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
        let delay = botConff.level[this.botLevel].timeOutsAfterPlaying[Math.floor(Math.random() * (botConff.level[this.botLevel].timeOutsAfterPlaying.length))]
        let min = botConff.reactionTimes[delay].min
        let max = botConff.reactionTimes[delay].max
        let delta = max - min
        let answer = botConff.level[this.botLevel].rightAnswer[Math.floor(Math.random() * (botConff.level[this.botLevel].rightAnswer.length))]

        delay = Math.floor(Math.random() * delta) + min

        this.timeouts.push(setTimeout(() => {
            this.socket.emit("answer", answer)

        }, timeout + delay))
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
        this.startingTimeout = setTimeout(() => {
            if (!room.gameStarted) this.initialize()
        }, botConff.startBotTimeOut[Math.floor(Math.random() * (botConff.startBotTimeOut.length))])
    }

    getBotLevel(rank) {
        for (let i = 0; i < botConff.rankLevels.length; i++) {
            if (rank > botConff.rankLevels[i].rank) {
                let chances = botConff.rankLevels[i].chances
                return chances[Math.floor(Math.random() * (chances.length))]

            }
        }
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