const User = require('../models/user')

class userData {
    constructor(id) {
        this.id = id
    }

    async initialize() {
        this.user = await User.findById(this.id)
    }

    async win() {
        this.user.games.onlineMode.wins++
        await this.user.save()
        console.log(this.user)
    }

    async lose() {
        this.user.games.onlineMode.loses++
        await this.user.save()
    }

}

async function s() {
    const a = new userData('5f65cf3c6f38072a080d9923')
    await a.initialize()
    //a.win()
}


s()