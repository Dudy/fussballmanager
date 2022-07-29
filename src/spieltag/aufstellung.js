import { data } from '../js/data.js'
import { init as initSubnavigation } from './subnavigation.js'
import { createCell, padWithZero } from '../js/utils.js'

export function show() {
    const aufstellungElement = document.querySelector('#spieltagAufstellungTemplate').content.cloneNode(true)

    initSubnavigation('aufstellung')

    const meineMannschaft = data.mannschaften[1]
    const nameDaten = Array.from(meineMannschaft.spieler, (spieler) => createCell(spieler.name))
    const positionDaten = Array.from(meineMannschaft.spieler, (spieler) => createCell(ermittlePosition(spieler)))
    const staerkeDaten = Array.from(meineMannschaft.spieler, (spieler) => {
        const bestePosition = ermittlePosition(spieler)
        const index = Object.keys(spieler.spielstaerke).indexOf(bestePosition)
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
        )      
    })
    
    aufstellungElement.querySelector('.bank [data-type="spielername"]').replaceChildren(...nameDaten)
    aufstellungElement.querySelector('.bank [data-type="position"]').replaceChildren(...positionDaten)
    aufstellungElement.querySelector('.bank [data-type="staerke"]').replaceChildren(...staerkeDaten)

    document.querySelector('#inhalt').replaceChildren(aufstellungElement)
}

function ermittlePosition(spieler) {
    return Object.keys(spieler.spielstaerke).reduce((a, b) => spieler.spielstaerke[a] > spieler.spielstaerke[b] ? a : b)
}
