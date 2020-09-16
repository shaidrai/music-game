function percentToChance(list = {}) {
    let keys = Object.keys(list)
    let values = Object.values(list)
    let min = Math.min.apply(null, list)
    let gcd = list[0];

    for (let i = 0; i < values.length; i++) {
        gcd = getGcd(gcd, values[i]);
    }


    result = []

    for (i = 0; i < keys.length; i++) {
        for (let t = 0; t < values[i] / gcd; t++) {
            result.push(keys[i])
        }
    }
    return result
}


function getGcd(a, b) {
    if (!b) {
        return a;
    }

    return getGcd(b, a % b);
}


module.exports = percentToChance