import { data } from '../data.js';
import { init as initSubnavigation } from './subnavigation.js';
import { createCell, padWithZero } from '../utils.js';

const RUECKENNUMMER_ID_PREFIX = 'rueckennummer-';

export function show() {
    initSubnavigation('letztesSpiel');
    
    const letztesSpielElement = document.querySelector('#spieltagLetztesSpielTemplate').content.cloneNode(true);

    if (data.letztesSpiel) {
        console.log(data.letztesSpiel);
        letztesSpielElement.querySelector('.spielergebnis .heim').textContent = data.mannschaften[data.letztesSpiel.heim].name
        letztesSpielElement.querySelector('.spielergebnis .ergebnis').textContent = data.letztesSpiel.toreHeim + ':' + data.letztesSpiel.toreGast
        letztesSpielElement.querySelector('.spielergebnis .gast').textContent = data.mannschaften[data.letztesSpiel.gast].name
    }

    /*
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
    
    letztesSpielElement.querySelector('.mannschaft [data-type="rueckennummer"]').replaceChildren(...nummerDaten);
    letztesSpielElement.querySelector('.mannschaft [data-type="spielername"]').replaceChildren(...nameDaten);
    letztesSpielElement.querySelector('.mannschaft [data-type="position"]').replaceChildren(...positionDaten);
    letztesSpielElement.querySelector('.mannschaft [data-type="staerke"]').replaceChildren(...staerkeDaten);
    */

    document.querySelector('#inhalt').replaceChildren(letztesSpielElement);
}
