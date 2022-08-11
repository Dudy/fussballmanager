import { amSelbenTag } from './utils.js';

export const data = {
    aktuellesDatum: new Date(2022, 7, 5, 0, 0, 0), // beware of the 0-based month ... 6 = July
    manager: {
        name: 'Dudy',
        mannschaft: 1
    },
    saisons: [],
    aktuelleSaison: 2022,
    aktuellerSpieltag: 0,
    statistiklevel: 0
};

export function aktuelleSaison() {
    const saisonIndex =
        data.aktuellesDatum.getMonth() > 5 ?
            data.aktuellesDatum.getFullYear() :
            data.aktuellesDatum.getFullYear() - 1;
    return data.saisons[saisonIndex];
}

export function istSpieltag(datum) {
    return getSpieltagIndex(datum) >= 0;
}

export function getSpieltagIndex(datum) {
    for (const [spieltagindex, spieltag] of Object.entries(aktuelleSaison().spieltage)) {
        if (amSelbenTag(spieltag.spiele[0].datum, datum)) {
            return parseInt(spieltagindex);
        } else if (spieltag.spiele[0].datum > datum) {
            break;
        }
    }
    return -1;
}

export function getLetztenSpieltagIndex(datum) {
    for (const [spieltagindex, spieltag] of Object.entries(aktuelleSaison().spieltage)) {
        if (spieltag.spiele[0].datum > datum) {
            const spieltagIndexNumber = parseInt(spieltagindex);
            return spieltagIndexNumber < 0 ? 0 : spieltagIndexNumber;
        }
    }
    return aktuelleSaison().spieltage.length;
}
