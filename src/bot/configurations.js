const precentToChance = require('./utills')

const conf =
{
    endpoint: "https://music-game-server.herokuapp.com",
    //endpoint: 'http://10.0.0.26:5000',
    level: {
        best: { timeOutsAfterPlaying: precentToChance({ veryFast: 60, fast: 30, ok: 10 }), rightAnswer: precentToChance({ correct: 80, wrong: 20 }) },
        good: { timeOutsAfterPlaying: precentToChance({ veryFast: 20, fast: 40, ok: 30, slow: 10 }), rightAnswer: precentToChance({ correct: 70, wrong: 30 }) },
        ok: { timeOutsAfterPlaying: precentToChance({ fast: 20, ok: 60, slow: 20 }), rightAnswer: precentToChance({ correct: 60, wrong: 40 }) },
        bad: { timeOutsAfterPlaying: precentToChance({ fast: 10, ok: 50, slow: 40 }), rightAnswer: precentToChance({ correct: 40, wrong: 60 }) },
    },

    startBotTimeOut: [4700, 3200, 5000, 4500, 3700],

    names: ["shirganon", "musicwizard112", "musicking", 'jonnyrogen', 'zzz', 'shaidrai', 'bach', 'jackyr', 'david', 'ninini', 'americanmozart', 'adirben', 'maorcohenn', 'ofirhillel', , "James", "Benjamin", "Jacob", "Michael", "Elijah", "Ethan", "Alexander", "Oliver", "Daniel", "Lucas", "Matthew", "Aiden", "Jackson", "Logan", "David", "Joseph", "Samuel", "Henry", "Owen", "Sebastian", "Gabriel", "Carter", "Jayden", "John", "Luke", "Anthony", "Isaac", "Dylan", "Wyatt", "Andrew", "Joshua", "Christopher", "Grayson", "Jack", "Julian", "Ryan", "Jaxon", "Levi", "Nathan", "Caleb", "Hunter", "Christian", "Isaiah", "Thomas", "Aaron", "Lincoln", "Charles", "Eli", "Landon", "Connor", "Josiah", "Jonathan", "Cameron", "Jeremiah", "Mateo", "Adrian", "Hudson", "Robert", "Nicholas", "Brayden", "Nolan", "Easton", "Jordan", "Colton", "Evan", "Angel", "Asher", "Dominic", "Austin", "Leo", "Adam", "Jace",],

    // What is the chance to fall on every bot level according to your rank
    rankLevels: [
        // above rank: level chances in precent
        { rank: 1200, chances: precentToChance({ ok: 20, good: 30, best: 50 }) },
        { rank: 1000, chances: precentToChance({ bad: 10, ok: 30, good: 40, best: 20 }) },
        { rank: 900, chances: precentToChance({ bad: 30, ok: 40, good: 20, best: 10 }) },
        { rank: -1, chances: precentToChance({ bad: 30, ok: 40, good: 30 }) }
    ],


    reactionTimes: {
        // min and max answer delay in milliseconds
        veryFast: { min: 200, max: 500 },
        fast: { min: 500, max: 1000 },
        ok: { min: 1000, max: 2000 },
        slow: { min: 2000, max: 4000 },
    },

    // bot rank 
    rank: {
        best: { min: 1800, max: 5000 },
        good: { min: 1300, max: 1800 },
        ok: { min: 1001, max: 1300 },
        bad: { min: 500, max: 1001 },
    }

}


module.exports = conf