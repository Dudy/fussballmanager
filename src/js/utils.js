export function randomInt(start = 0, end = 1) {
    return Math.floor(Math.random() * (end - start)) + start
}

export function randomBool() {
    return Math.random() > 0.5
}

export function randomDate(start, end) {
    if (start instanceof Date && end instanceof Date) {
        const startInt = Math.floor(start.getTime() / 1000)
        const endInt = Math.floor(end.getTime() / 1000)
        const randomTimestamp = randomInt(startInt, endInt)
        return new Date(randomTimestamp * 1000)
    } else {
        return new Date()
    }
}
