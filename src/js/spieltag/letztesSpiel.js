import { data } from '../data.js';
import { init as initSubnavigation } from './subnavigation.js';
import { createCell } from '../utils.js';

const RUECKENNUMMER_ID_PREFIX = 'rueckennummer-';

export function show() {
    const letztesSpielElement = document.querySelector('#spieltagLetztesSpielTemplate').content.cloneNode(true);

    if (data.letztesSpiel) {
        letztesSpielElement.querySelector('.spielergebnis .heim').textContent = data.mannschaften[data.letztesSpiel.heim].name;
        letztesSpielElement.querySelector('.spielergebnis .ergebnis').textContent = data.letztesSpiel.toreHeim + ':' + data.letztesSpiel.toreGast;
        letztesSpielElement.querySelector('.spielergebnis .gast').textContent = data.mannschaften[data.letztesSpiel.gast].name;
        
        // Format Statistikeintrag:
        //
        // <ballbesitz>: <boolean>: HEIM = true, GAST = false
        // <ballposition>: <number>: HEIMDRITTEL = 0, MITTELFELD = 1, GASTDRITTEL = 2
        //
        // {
        //     halbzeit: <number>,
        //     minute: <number>,
        //     ballbesitzVorher: <ballbesitz>,
        //     ballbesitzNachher: <ballbesitz>,
        //     ballpositionVorher: <ballposition>,
        //     ballpositionNachher: <ballposition>,
        //     text: <string>,
        //     level: <number>
        // }

        const statistikDatenNachLevelGefiltert = data.letztesSpiel.statistik.filter((statistikeintrag) => {
            return statistikeintrag.level <= data.statistiklevel;
        });

        const minutendaten = Array.from(statistikDatenNachLevelGefiltert, statistikeintrag => createCell(statistikeintrag.minute + '. Minute'));
        const ballbesitzdaten = Array.from(statistikDatenNachLevelGefiltert, (statistikeintrag) => {
            const mannschaftsindex = statistikeintrag.ballbesitzNachher ? data.letztesSpiel.heim : data.letztesSpiel.gast;
            return createCell(`(${data.mannschaften[mannschaftsindex].name})`);
        });
        const textdaten = Array.from(statistikDatenNachLevelGefiltert, statistikeintrag => createCell(statistikeintrag.text));
        letztesSpielElement.querySelector('.statistikminute').replaceChildren(...minutendaten);
        letztesSpielElement.querySelector('.statistikballbesitz').replaceChildren(...ballbesitzdaten);
        letztesSpielElement.querySelector('.statistiktext').replaceChildren(...textdaten);

        letztesSpielElement.querySelector('.statistiknavigation p span').textContent = data.statistiklevel;
        letztesSpielElement.querySelector('#wenigerStatistik').disabled = data.statistiklevel === 0;
        letztesSpielElement.querySelector('#mehrStatistik').disabled = data.statistiklevel === 4;
    }

    document.querySelector('#inhalt').replaceChildren(letztesSpielElement);

    addEventHandler();
    initSubnavigation('letztesSpiel');
}

function addEventHandler() {
    document.querySelector('#wenigerStatistik').addEventListener('click', wenigerStatistik);
    document.querySelector('#mehrStatistik').addEventListener('click', mehrStatistik);
}

function wenigerStatistik() {
    if (data.statistiklevel > 0) {
        data.statistiklevel--;
        show();
    }
}

function mehrStatistik() {
    if (data.statistiklevel < 4) {
        data.statistiklevel++;
        show();
    }
}
