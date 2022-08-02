import { randomDate, randomInt, shuffle } from './utils.js';
import { data } from './data.js';

export async function init() {
    data.mannschaften = await (
        await fetch("http://localhost:8080/js/mannschaften.json")
    ).json();
    data.anzahlMannschaften = Object.keys(data.mannschaften).length;
    data.anzahlSpieltage = (data.anzahlMannschaften - 1) * 2;
    data.aktuelleSaison = 2022;
    data.aktuellerSpieltag = -1;
    data.namen = await (
        await fetch("http://localhost:8080/js/namen.json")
    ).json();
    data.saisons = [];

    fuegeSpielerZuMannschaftenHinzu();
    erstelleStartelfs();
    erzeugeSaisons();
}

function erzeugeSpieler(rueckennummer, startDate, endDate, istTorwart) {
    return {
        rueckennummer: rueckennummer,
        name:
            data.namen.vornamen[randomInt(0, data.namen.vornamen.length)] +
            " " +
            data.namen.nachnamen[randomInt(0, data.namen.nachnamen.length)],
        spielstaerke: {
            tor: istTorwart ? randomInt(30, 100) : randomInt(0, 30),
            verteidigung: istTorwart ? randomInt(0, 30) : randomInt(30, 100),
            mittelfeld: istTorwart ? randomInt(0, 30) : randomInt(30, 100),
            angriff: istTorwart ? randomInt(0, 30) : randomInt(30, 100)
        },
        geburtsdatum: randomDate(startDate, endDate)
    };
}

function fuegeSpielerZuMannschaftenHinzu() {
    const today = new Date();
    const startDate = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 40); // max. 40 Jahre alt
    const endDate = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 16); // min. 16 Jahre alt
    
    for (const mannschaft of Object.values(data.mannschaften)) {
        // ein Array mit den zufällig verteilten Zahlen von 1 bis 99 (1 ist immer an erster Stelle, für den ersten Torwart ;-))
        let rueckennummern = [1].concat(shuffle(Array.from({length: 98}, (_, i) => i + 2)));
        mannschaft.spieler = [];

        // drei Torhüter, 15 Feldspieler
        for (let i = 0; i < 18; i++) {
            mannschaft.spieler.push(erzeugeSpieler(rueckennummern[i], startDate, endDate, i < 3));
        }
    }
}

function erstelleStartelfs() {
    // - erzeuge neues Arrays mit allen Spielern
    // - Angriff
    //   - sortiere Array nach "Angriff" Stärke
    //   - nimm die zwei stärksten Spieler
    //   - setze sie auf LA und RA
    //   - entferne sie aus dem Array
    // - Mittelfeld
    //   - sortiere Array nach "Mittelfeld" Stärke
    //   - nimm die vier stärksten Spieler
    //   - setze sie auf LM, LZM, RZM und RM
    //   - entferne sie aus dem Array
    // - Verteidigung
    //   - sortiere Array nach "Verteidigung" Stärke
    //   - nimm die vier stärksten Spieler
    //   - setze sie auf LV, LIV, RIV und RV
    //   - entferne sie aus dem Array
    // - Torwart
    //   - sortiere Array nach "Torwart" Stärke
    //   - nimm den stärksten Spieler
    //   - setze ihn auf TW

    function getSpielerComparatorAufPosition(position) {
        return function vergleicheZweiSpielerAufGegebenerPosition(einSpieler, andererSpieler) {
            return andererSpieler.spielstaerke[position] - einSpieler.spielstaerke[position];
        };
    }

    for (const mannschaft of Object.values(data.mannschaften)) {
        const alleSpieler = Array.from(mannschaft.spieler);
        alleSpieler.sort(getSpielerComparatorAufPosition('angriff'));
        mannschaft.startelf['LA'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['RA'] = alleSpieler.shift().rueckennummer.toString()

        alleSpieler.sort(getSpielerComparatorAufPosition('mittelfeld'));
        mannschaft.startelf['LM'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['LZM'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['RZM'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['RM'] = alleSpieler.shift().rueckennummer.toString()
        
        alleSpieler.sort(getSpielerComparatorAufPosition('verteidigung'));
        mannschaft.startelf['LV'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['LIV'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['RIV'] = alleSpieler.shift().rueckennummer.toString()
        mannschaft.startelf['RV'] = alleSpieler.shift().rueckennummer.toString()

        alleSpieler.sort(getSpielerComparatorAufPosition('tor'));
        mannschaft.startelf['TW'] = alleSpieler.shift().rueckennummer.toString()
    }
}

function erzeugeSpieltagspaarungen(spieltagNullBasiert) {
    // siehe https://de.wikipedia.org/wiki/Spielplan_(Sport)

    // sei die Anzahl der Mannschaften z = 18
    // sei A die zufällige Liste der 18 Mannschaften
    // sei INDEX der Index jeder Mannschaft in der Liste
    // sei JOKER die Mannschaft mit INDEX == 18

    // für Spieltag n (1 <= n <= 17) gilt:
    //     Verein k spielt gegen Verein l, wobei gilt:
    //         (k + l) % 17 == 0
    // Dies wird an jedem Spieltag genau eine Mannschaft übrig lassen.
    // Diese spielt gegen den JOKER.

    // Ist (k + l) % 2 == 0, dann hat die Mannschaft mit dem höheren Index Heimrecht.
    // Ist (k + l) % 2 == 1, dann hat die Mannschaft mit dem niedrigeren Index Heimrecht.
    // Der Joker hat Heimrecht gegen die Mannschaften 8 - 16.
    // In der Rückrunde wird einfach getauscht.

    // Der Algorithmus braucht die Nummer des Spieltags Eins-Basiert, das heißt
    // der erste Spieltag ist "Spieltag 1". Überall sonst im Code ist der Spieltag 0-basiert.
    const spieltag = spieltagNullBasiert + 1;
    const alleMannschaften = [...Array(data.anzahlMannschaften).keys()];
    // 0-Item rauswerfen
    alleMannschaften.shift();

    let mannschaft1;
    let mannschaft2;
    const grenze = Math.ceil(spieltag / 2);
    const spiele = [];
    const offset = data.anzahlMannschaften - 1;
    const jokerHeimgrenze = (data.anzahlMannschaften - 2) / 2;

    while (alleMannschaften.length > 1) {
        mannschaft1 = alleMannschaften.shift();
        mannschaft2 = spieltag - mannschaft1;
        if (mannschaft1 === mannschaft2) {
            alleMannschaften.push(mannschaft1);
            continue
        }
        if (mannschaft1 >= grenze) {
            mannschaft2 += offset;
        }
        alleMannschaften.splice(alleMannschaften.indexOf(mannschaft2), 1);
        spiele.push({
            heim:
                ((mannschaft1 + mannschaft2) % 2 === 0
                    ? Math.max(mannschaft1, mannschaft2)
                    : Math.min(mannschaft1, mannschaft2)) - 1,
            gast:
                ((mannschaft1 + mannschaft2) % 2 === 0
                    ? Math.min(mannschaft1, mannschaft2)
                    : Math.max(mannschaft1, mannschaft2)) - 1
        });
    }

    spiele.push({
        heim:
            alleMannschaften[0] >= jokerHeimgrenze && alleMannschaften[0] <= 2 * jokerHeimgrenze
                ? offset
                : alleMannschaften[0] - 1,
        gast:
            alleMannschaften[0] >= jokerHeimgrenze && alleMannschaften[0] <= 2 * jokerHeimgrenze
                ? alleMannschaften[0] - 1
                : offset
    });

    return spiele;
}

function erzeugeSaisons() {
    data.saisons = {
        2022: {
        saison: "2022/2023",
        startdatum: new Date("2022-08-06T13:30:00Z"),
        spieltage: {}
        }
    };

    const saisonIndex = 2022;
    const saison = data.saisons[saisonIndex];

    let datum = saison.startdatum;

    for (let spieltagIndex = 0; spieltagIndex < data.anzahlSpieltage; spieltagIndex++) {
        const spieltag = {
            spiele: {}
        };
        saison.spieltage[spieltagIndex] = spieltag;

        const spieltagspaarungen = erzeugeSpieltagspaarungen(spieltagIndex);
        for (let spielIndex = 0; spielIndex < spieltagspaarungen.length; spielIndex++) {
            spieltag.spiele[spielIndex] = {
                datum: datum.toISOString(),
                heim: spieltagspaarungen[spielIndex].heim,
                gast: spieltagspaarungen[spielIndex].gast,
                toreHeim: randomInt(0, 4),
                toreGast: randomInt(0, 4)
            };
        }

        datum.setDate(datum.getDate() + 7);
    }
}
