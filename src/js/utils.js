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

export function amSelbenTag(datum0, datum1) {
    return datum0.getFullYear() === datum1.getFullYear() &&
    datum0.getMonth() === datum1.getMonth() &&
    datum0.getDate() === datum1.getDate();
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

            if (draggable) {
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

/* ----- subnavigation ----- */
export function initHauptnavigation(navigationFunctions) {
    // Template instanziieren
    const navigationElement = document.querySelector('#hauptnavigationTemplate').content.cloneNode(true);
    const navigationContainer = navigationElement.querySelector('nav');

    // Liste der Navigationsitems aufbauen
    const navListItems = Array.from(Object.keys(navigationFunctions), item => erzeugeNavItem(item, navigationContainer, navigationFunctions));
    const navListe = navigationContainer.querySelector('ul.nav-links');
    navListe.replaceChildren(...navListItems);

    // zu Beginn ist immer der erste Eintrag der aktive Eintrag
    navListe.querySelector(`a[href="#${Object.keys(navigationFunctions)[0]}"]`).parentElement.classList.add('active');

    // DOM Baum aktualisieren
    document.querySelector('#hauptnavigation').replaceChildren(navigationElement);
}

export function initSubnavigation(navigationFunctions) {
    // Template instanziieren
    const subnavigationElement = document.querySelector('#subnavigationTemplate').content.cloneNode(true);
    const navigationContainer = subnavigationElement.querySelector('nav');

    // Liste der Navigationsitems aufbauen
    const navListItems = Array.from(Object.keys(navigationFunctions), item => erzeugeNavItem(item, navigationContainer, navigationFunctions));
    const navListe = navigationContainer.querySelector('ul.nav-links');
    navListe.replaceChildren(...navListItems);

    // zu Beginn ist immer der erste Eintrag der aktive Eintrag
    navListe.querySelector(`a[href="#${Object.keys(navigationFunctions)[0]}"]`).parentElement.classList.add('active');

    // DOM Baum aktualisieren
    document.querySelector('#subnavigation').replaceChildren(subnavigationElement);
}

function erzeugeNavItem(item, navigationContainer, navigationFunctions) {
    const anchor = document.createElement('a');
    anchor.href = `#${item}`;
    anchor.appendChild(document.createTextNode(item[0].toUpperCase() + item.substring(1)));
    anchor.addEventListener('click', createClickHandler(navigationContainer, navigationFunctions));
    
    const listItem = document.createElement('li');
    listItem.classList.add('nav-item');
    listItem.appendChild(anchor);

    return listItem;
}

export function createClickHandler(navigationContainer, navigationFunctions) {
    return function(event) {
        // Navigation managen
        navigationContainer.querySelectorAll('li.nav-item').forEach(item => item.classList.remove('active'));
        event.target.parentElement.classList.add('active');

        // Inhalt umschalten
        const sektion = event.target.href.split('#')[1];
        navigationFunctions[sektion]();
    }
}














export function ermittlePosition(spieler) {
    return ermittleBestePositionAusSpielstaerke(spieler.spielstaerke);
}

export function ermittleBestePositionAusSpielstaerke(spielstaerke) {
    return Object.keys(spielstaerke).reduce((a, b) => spielstaerke[a] > spielstaerke[b] ? a : b);
}
