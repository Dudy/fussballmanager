import { data } from '../data.js';
import { init as initSubnavigation } from './subnavigation.js';
import { createCell, padWithZero, ermittlePosition } from '../utils.js';

const RUECKENNUMMER_ID_PREFIX = 'rueckennummer-';

export function show() {
    // Navigation
    initSubnavigation('aufstellung');
    
    const aufstellungElement = document.querySelector('#spieltagAufstellungTemplate').content.cloneNode(true);

    // initiale Befüllung der Mannschaft
    const meineMannschaft = data.mannschaften[data.manager.mannschaft];
    const nummerDaten = Array.from(meineMannschaft.spieler, (spieler) => createCell(spieler.rueckennummer, [], RUECKENNUMMER_ID_PREFIX + spieler.rueckennummer, true));
    const nameDaten = Array.from(meineMannschaft.spieler, (spieler) => createCell(spieler.name));
    const positionDaten = Array.from(meineMannschaft.spieler, (spieler) => createCell(ermittlePosition(spieler)));
    const staerkeDaten = Array.from(meineMannschaft.spieler, (spieler) => {
        const bestePosition = ermittlePosition(spieler);
        const index = Object.keys(spieler.spielstaerke).indexOf(bestePosition);
        return createCell(
            [
                padWithZero(spieler.spielstaerke.tor, 2),
                '/',
                padWithZero(spieler.spielstaerke.verteidigung, 2),
                '/',
                padWithZero(spieler.spielstaerke.mittelfeld, 2),
                '/',
                padWithZero(spieler.spielstaerke.angriff, 2)
            ],[2 * index]
        );
    });
    
    aufstellungElement.querySelector('.mannschaft [data-type="rueckennummer"]').replaceChildren(...nummerDaten);
    aufstellungElement.querySelector('.mannschaft [data-type="spielername"]').replaceChildren(...nameDaten);
    aufstellungElement.querySelector('.mannschaft [data-type="position"]').replaceChildren(...positionDaten);
    aufstellungElement.querySelector('.mannschaft [data-type="staerke"]').replaceChildren(...staerkeDaten);

    document.querySelector('#inhalt').replaceChildren(aufstellungElement);

    // Drag'N'Drop Handling
    document.querySelectorAll('.flex-startelf [data-position]').forEach((cell) => {
        cell.addEventListener('drop', drop_handler);
        cell.addEventListener('dragover', dragover_handler);
        cell.addEventListener('dragenter', dragenter_handler);
        cell.addEventListener('dragleave', dragleave_handler);
    });

    // initiale Befüllung der Startelf
    for (const [key, value] of Object.entries(meineMannschaft.startelf)) {
        if (value !== '') {
            // in der Mannschaft
            document.querySelector('#' + RUECKENNUMMER_ID_PREFIX + value).classList.add('in-startelf');

            // in der Startelf
            const cell = document.querySelector(`.flex-startelf [data-position="${key}"]`)
            cell.classList.add('in-startelf');
            cell.dataset.id = RUECKENNUMMER_ID_PREFIX + value;
            cell.textContent = value;
        }
    }
}

function drop_handler(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData('text/plain');

    // prüfe, ob der Spieler, der an eine Position gesetzt werden soll, bereits auf einer anderen Position sitzt und lösche ihn dann dort
    document.querySelectorAll('.flex-startelf [data-position]').forEach((cell) => {
        if (cell.dataset.id === id) {
            cell.classList.remove('in-startelf');
            cell.textContent = cell.dataset.position;
            document.querySelector('#' + cell.dataset.id).classList.remove('in-startelf');
            delete cell.dataset.id;
            data.mannschaften[data.manager.mannschaft].startelf[cell.dataset.position] = '';
        }
    });

    if (ev.target.dataset.id) {
        // bisherigen Spieler aus der Startelf entfernen
        document.querySelector('#' + ev.target.dataset.id).classList.remove('in-startelf');
    }
    
    // neuen Spieler in die Startelf aufnehmen
    document.querySelector('#' + id).classList.add('in-startelf');
    ev.target.classList.remove('dragging');
    ev.target.classList.add('in-startelf');
    ev.target.dataset.id = id;
    ev.target.textContent = id.split('-')[1];
    data.mannschaften[data.manager.mannschaft].startelf[ev.target.dataset.position] = ev.target.textContent;
}
function dragover_handler(ev) {
    ev.preventDefault();
}
function dragenter_handler(ev) {
    ev.preventDefault();
    ev.target.classList.add('dragging');
}
function dragleave_handler(ev) {
    ev.preventDefault();
    ev.target.classList.remove('dragging');
}
