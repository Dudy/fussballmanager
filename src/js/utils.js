export function randomInt(start = 0, end = 1) {
    return Math.floor(Math.random() * (end - start)) + start;
}

export function randomBool() {
    return Math.random() > 0.5;
}

export function randomDate(start, end) {
    if (start instanceof Date && end instanceof Date) {
        const startInt = Math.floor(start.getTime() / 1000);
        const endInt = Math.floor(end.getTime() / 1000);
        const randomTimestamp = randomInt(startInt, endInt);
        return new Date(randomTimestamp * 1000);
    } else {
        return new Date();
    }
}

export function formatDatum(datum) {
    if (datum instanceof Date) {
        return datum.toLocaleDateString('DE-de', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } else {
        return formatDatum(new Date(datum));
    }
}

export function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
}

export function createCell(text, emphasizes = [], id = false, draggable = false) {
    if (!Array.isArray(text)) {
        text = [text];
    }
    const cellNode = document.createElement('cell');

    for (let i = 0; i < text.length; i++) {
        const textNode = document.createTextNode(text[i]);
        if (emphasizes.includes(i)) {
            const boldNode = document.createElement('b');
            boldNode.appendChild(textNode);
            cellNode.appendChild(boldNode);
        } else {
            cellNode.appendChild(textNode);
        }
        if (id) {
            const rueckennummer = id.split('-')[1]
            cellNode.setAttribute('id', id);
            cellNode.addEventListener('dragend', (ev) => {
                ev.target.classList.remove('dragging');
            })
            cellNode.addEventListener('dragstart', (ev) => {
                ev.target.classList.add('dragging');
                ev.effectAllowed = 'move';
                ev.dataTransfer.setData('text/plain', ev.target.id);

                const canvas = document.createElement('canvas');
                document.body.append(canvas);
                const context = canvas.getContext('2d');
                context.font = '20px Helvetica';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.beginPath();
                context.arc(25, 25, 25, 0, Math.PI * 2);
                context.fillStyle = getComputedStyle(canvas).getPropertyValue('--light');
                context.fill();
                context.strokeStyle = context.fillStyle;
                context.stroke();
                context.closePath();
                context.fillStyle = getComputedStyle(canvas).getPropertyValue('--textcolor');
                context.fillText(rueckennummer, 25, 25);

                ev.dataTransfer.setDragImage(canvas, 60, 60);
            });
        }
        if (draggable) {
            cellNode.setAttribute('draggable', true);
        }
    }
    
    return cellNode;
}

/**
* Shuffles array in place. ES6 version
* @param {Array} a items An array containing the items.
*/
export function shuffle(a) {
   for (let i = a.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [a[i], a[j]] = [a[j], a[i]];
   }
   return a;
}
