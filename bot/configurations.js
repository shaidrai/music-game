const conf =
{
    endpoint: "https://music-game-server.herokuapp.com",
    //endpoint: 'http://10.0.0.26:5000',
    rightAnswer: ['correct', 'correct', 'wrong'],
    level: {
        ok: { timeOutsAfterPlaying: [500, 500, 1000, 1300, 2000, 3000, 700, 3700, 2400], rightAnswer: ['correct', 'correct', 'wrong'] },
        good: { timeOutsAfterPlaying: [500, 500, 700, 1300, 1000, 1000, 800, 400, 600], rightAnswer: ['correct', 'correct', 'correct', 'wrong'] },
        bad: { timeOutsAfterPlaying: [2000, 2000, 1500, 1300, 2000, 3000, 5000, 3700, 2400], rightAnswer: ['correct', 'correct', 'correct', 'wrong', 'wrong'] },
        best: { timeOutsAfterPlaying: [500, 500, 300, 100, 400, 600, 1000, 200, 100], rightAnswer: ['correct', 'correct', 'correct', 'correct', 'wrong'] },
    },
    rank: [123, 254, -122, -357, 576, 53, 28, 15, -17, -19, 0, 0, 340],
    startBotTimeOut: [4700, 3200, 5000, 4500, 3700],
    names: ["musicwizard112", "musicking", 'jonnyrogen', 'zzz', 'shaidrai', 'hodiel', 'kaki', 'poopy55', 'bach', 'jackyr', 'david', 'ninini', 'americanmozart', 'adirh', 'maorcohenn', 'ofirhillel']
}

module.exports = conf