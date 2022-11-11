export const data = {
    //aktuellesDatum: new Date(2022, 6, 1, 12, 0, 0), // beware of the 0-based month ... 6 = July
    heute: Date.UTC(2022, 7, 4), // beware of the 0-based month ... 6 = July

    manager: {
        name: 'Dudy',
        mannschaft: 1
    },
    
    // neues Datenmodell: Spiele sind nun das Hauptelement
    spiele: {},


    aktuelleSaison: 2022,
    aktuellerSpieltag: -1,
    statistiklevel: 0
};

export function istSpieltag(datum) {
    return Object.keys(data.spiele).includes(datum);
}
