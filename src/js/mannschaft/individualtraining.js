import { data } from '../data.js';
import { createCell, padWithZero, ermittlePosition } from '../utils.js';

const RUECKENNUMMER_ID_PREFIX = 'rueckennummer-';

export function show() {
    const individualtrainingElement = document.querySelector('#mannschaftIndividualtrainingTemplate').content.cloneNode(true);

    // initiale Befüllung der Mannschaft
    const meineMannschaft = data.mannschaften[data.manager.mannschaft];
    const nummerDaten = Array.from(meineMannschaft.spieler, (spieler) => {
        const cell = createCell(spieler.rueckennummer, [], RUECKENNUMMER_ID_PREFIX + spieler.rueckennummer, false);
        cell.addEventListener('click', cellClick);
        cell.dataset.rueckennummer = spieler.rueckennummer;
        return cell;
    });
    const nameDaten = Array.from(meineMannschaft.spieler, (spieler) => {
        const cell = createCell(spieler.name);
        cell.addEventListener('click', cellClick);
        cell.dataset.rueckennummer = spieler.rueckennummer;
        return cell;
    });
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
    
    const mannschaftstabelle = individualtrainingElement.querySelector('.mannschaftstabelle');
    mannschaftstabelle.querySelector('column[data-type="rueckennummer"]').replaceChildren(...nummerDaten);
    mannschaftstabelle.querySelector('column[data-type="spielername"]').replaceChildren(...nameDaten);
    mannschaftstabelle.querySelector('column[data-type="position"]').replaceChildren(...positionDaten);
    mannschaftstabelle.querySelector('column[data-type="staerke"]').replaceChildren(...staerkeDaten);

    document.querySelector('#inhalt').replaceChildren(individualtrainingElement);

    addEventHandler();
}

function trainingsfokusChanged(event) {
    const rueckennummer = parseInt(event.target.parentElement.parentElement.dataset.rueckennummer);
    const ausgewaehlterSpieler = data.mannschaften[data.manager.mannschaft].spieler.find(spieler => spieler.rueckennummer === rueckennummer);
    ausgewaehlterSpieler.trainingsfokus = event.target.value;
}

function addEventHandler() {
    document.querySelectorAll('column.trainingsfokus cell input').forEach(input => input.addEventListener('click', trainingsfokusChanged));
}

function cellClick(event) {
    document.querySelectorAll('.mannschaftstabelle cell').forEach(cell => cell.classList.remove('active'));

    const rowIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    document.querySelectorAll('.mannschaftstabelle column').forEach(column => column.childNodes[rowIndex].classList.add('active'));

    const rueckennummer = parseInt(event.target.dataset.rueckennummer);
    const ausgewaehlterSpieler = data.mannschaften[data.manager.mannschaft].spieler.find(spieler => spieler.rueckennummer === rueckennummer);

    document.querySelector('.spieler p').textContent = ausgewaehlterSpieler.name;
    document.querySelector('column.trainingsfokus').dataset.rueckennummer = ausgewaehlterSpieler.rueckennummer;

    const staerkeCells = document.querySelectorAll('column.spielerstaerke cell');
    staerkeCells[1].textContent = ausgewaehlterSpieler.spielstaerke['tor'];
    staerkeCells[2].textContent = ausgewaehlterSpieler.spielstaerke['verteidigung'];
    staerkeCells[3].textContent = ausgewaehlterSpieler.spielstaerke['mittelfeld'];
    staerkeCells[4].textContent = ausgewaehlterSpieler.spielstaerke['angriff'];

    const trainingsfokusInputs = document.querySelectorAll('column.trainingsfokus cell input');
    trainingsfokusInputs[0].checked = ausgewaehlterSpieler.trainingsfokus === 'tor';
    trainingsfokusInputs[1].checked = ausgewaehlterSpieler.trainingsfokus === 'verteidigung';
    trainingsfokusInputs[2].checked = ausgewaehlterSpieler.trainingsfokus === 'mittelfeld';
    trainingsfokusInputs[3].checked = ausgewaehlterSpieler.trainingsfokus === 'angriff';
    
    const trainingsfortschrittCells = document.querySelectorAll('column.trainingsfortschritt cell');
    trainingsfortschrittCells[1].textContent = ausgewaehlterSpieler.trainingsfortschritt['tor'] + '%';
    trainingsfortschrittCells[2].textContent = ausgewaehlterSpieler.trainingsfortschritt['verteidigung'] + '%';
    trainingsfortschrittCells[3].textContent = ausgewaehlterSpieler.trainingsfortschritt['mittelfeld'] + '%';
    trainingsfortschrittCells[4].textContent = ausgewaehlterSpieler.trainingsfortschritt['angriff'] + '%';
}
