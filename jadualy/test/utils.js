function fail(message) {
    console.error("Test failed:", message)
    return false
}

function test(condition, message, messageForPass) {
    if (condition) {
        if (messageForPass) console.log(messageForPass)
        return true
    } else {
        console.error("Test failed:", message)
        return false
    }
}


Array.prototype.spliceRandom = function() {
    if (this.length == 0) return undefined

    const index = Math.round(Math.random() * (this.length - 1))
    return this.splice(index, 1)[0]
}


function randomLetter() { Nothing > String
    return "abcdefghijklmnopqrstuvwxyz".split('')[random(0, 25)]
}

function randomSyllable() { Nothing > String
    const consonants = "bcdfghjklmnpqrstvwxyz".split('')
    const vowel = "aeiou".split('').spliceRandom()
    return consonants.spliceRandom() + vowel + consonants.spliceRandom()
}