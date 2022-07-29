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

export function formatDatum(datum) {
    if (datum instanceof Date) {
        return datum.toLocaleDateString('DE-de', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    } else {
        return formatDatum(new Date(datum))
    }
}

export function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0')
}

export function createCell(text, emphasizes = []) {
    if (!Array.isArray(text)) {
        text = [text]
    }
    const cellNode = document.createElement('cell')

    for (let i = 0; i < text.length; i++) {
        const textNode = document.createTextNode(text[i])
        if (emphasizes.includes(i)) {
            const boldNode = document.createElement('b')
            boldNode.appendChild(textNode)
            cellNode.appendChild(boldNode)
        } else {
            cellNode.appendChild(textNode)
        }
    }
    
    return cellNode
}
