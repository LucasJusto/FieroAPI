export default function randomStringGenerator(length: number): string {
    var randomString = ''
    var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ'

    for (var i = 0; i < length; i++) {
        randomString += possibleCharacters.charAt(getRandomInt(26))
    }

    return randomString
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}