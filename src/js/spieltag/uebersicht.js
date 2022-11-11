import { data } from '../data.js';
import { createCell, formatDatum } from '../utils.js';
import { init as initSubnavigation } from './subnavigation.js';

export function show() {
    const spieltagElement = document.querySelector('#spieltagUebersichtTemplate').content.cloneNode(true);
    fillTabelle(spieltagElement);
    fillSpieltag(spieltagElement);
    document.querySelector('#inhalt').replaceChildren(spieltagElement);
    
    addEventHandler();
    initSubnavigation('uebersicht');
}

function addEventHandler() {
    document.querySelector('#voriger-spieltag').addEventListener('click', vorigerSpieltag);
    document.querySelector('#naechster-spieltag').addEventListener('click', naechsterSpieltag);
}

function addSpielToTabelle(tabelle, spiel) {
    const mannschaftHeim = tabelle.mannschaften[spiel.heim];
    mannschaftHeim.spiele += 1;
    const mannschaftGast = tabelle.mannschaften[spiel.gast];
    mannschaftGast.spiele += 1;

    mannschaftHeim.tore += spiel.toreHeim;
    mannschaftHeim.gegentore += spiel.toreGast;
    if (spiel.toreHeim > spiel.toreGast) {
        mannschaftHeim.punkte += 3;
    } else if (spiel.toreHeim === spiel.toreGast) {
        mannschaftHeim.punkte += 1;
    }

    mannschaftGast.tore += spiel.toreGast;
    mannschaftGast.gegentore += spiel.toreHeim;
    if (spiel.toreGast > spiel.toreHeim) {
        mannschaftGast.punkte += 3;
    } else if (spiel.toreGast === spiel.toreHeim) {
        mannschaftGast.punkte += 1;
    }
}
 
function mannschaftComparator(mannschaft0, mannschaft1) {
    if (mannschaft0.punkte > mannschaft1.punkte) {
        return -1;
    } else if (mannschaft0.punkte < mannschaft1.punkte) {
        return 1;
    } else {
        const tordifferenz0 = mannschaft0.tore - mannschaft0.gegentore;
        const tordifferenz1 = mannschaft1.tore - mannschaft1.gegentore;
  
        if (tordifferenz0 > tordifferenz1) {
            return -1;
        } else if (tordifferenz0 < tordifferenz1) {
            return 1;
        } else {
            if (mannschaft0.tore > mannschaft1.tore) {
            return -1;
            } else if (mannschaft0.tore < mannschaft1.tore) {
            return 1;
            } else {
            return 0;
            }
        }
    }
}

export function fillTabelle(node = document.querySelector('#inhalt')) {
    const spiele = Object.entries(data.spiele)      // aus allen Spielen
        .filter(item => item[0] < data.heute)       // ermittle die bereits absolvierten Spieltage
        .map(item => item[1])                       // verwende alle Spiele des Spieltags
        .flat();                                    // und sammle sie in einem Array

    const tabelle = {
        spieltag: 0,
        mannschaften: []
    };
    for (const id of Object.keys(data.mannschaften)) {
        tabelle.mannschaften.push({
            id: id,
            spiele: 0,
            tore: 0,
            gegentore: 0,
            punkte: 0
        });
    }

    let platzDaten = [...Array(18).keys()].map((i) => createCell(i + 1 + "."))
    let nameDaten;
    let spieleDaten;
    let toreDaten;
    let punkteDaten;

    if (spiele.length === 0) {
        nameDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(data.mannschaften[mannschaft.id].name));
        spieleDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell('0'));
        toreDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell('0:0'));
        punkteDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell('0'));
    } else {
        spiele.forEach(spiel => addSpielToTabelle(tabelle, spiel));
        tabelle.mannschaften.sort(mannschaftComparator);

        // Nach der Berechnung der Tabelle des aktuellen Spieltags kann man jetzt einfach die Daten rausmappen.
        nameDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(data.mannschaften[mannschaft.id].name));
        spieleDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.spiele));
        toreDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.tore + ':' + mannschaft.gegentore));
        punkteDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.punkte));
    }
  
    // Überschrift davorsetzen
    platzDaten.unshift(createCell("Platz"));
    nameDaten.unshift(createCell("Mannschaftsname"));
    spieleDaten.unshift(createCell("Spiele"));
    toreDaten.unshift(createCell("Tore"));
    punkteDaten.unshift(createCell("Punkte"));

    // Tabellenspalten aktualisieren
    node
        .querySelector('.tabelle [data-type="platz"]')
        .replaceChildren(...platzDaten);
    node
        .querySelector('.tabelle [data-type="mannschaftsname"]')
        .replaceChildren(...nameDaten);
    node
        .querySelector('.tabelle [data-type="spiele"]')
        .replaceChildren(...spieleDaten);
    node
        .querySelector('.tabelle [data-type="tore"]')
        .replaceChildren(...toreDaten);
    node
        .querySelector('.tabelle [data-type="punkte"]')
        .replaceChildren(...punkteDaten);
}

export function fillSpieltag(node = document.querySelector('#inhalt')) {
    const datumNaechsterSpieltag = Object.keys(data.spiele)     // von allen Spielen
        .filter(timestamp => timestamp >= data.heute)           // die in der Zukunft liegen
        .sort()[0];                                             // nimm das kleinste Datum
    const spiele = data.spiele[datumNaechsterSpieltag];

    // im Code ist der erste Spieltag am Index 0, aber wir zeigen auf der UI natürlich "1" an
    node
        .querySelector('.spieltag p span')
        .textContent = data.aktuellerSpieltag + 1;

    let datumDaten;
    let heimDaten;
    let ergebnisDaten;
    let gastDaten;

    // Daten ermitteln aus ...
    if (data.aktuellerSpieltag === -1) {
        // ... den Spielen des ersten Spieltags, aber ohne die Ergebnisse
        datumDaten = Array.from(spiele, spiel => createCell(formatDatum(spiel.datum)));
        heimDaten = Array.from(spiele, spiel => createCell(data.mannschaften[spiel.heim].name));
        ergebnisDaten = Array.from(spiele, () => createCell('---'));
        gastDaten = Array.from(spiele, spiel => createCell(data.mannschaften[spiel.gast].name));
    } else {
        // ... den Spielen des gewählten Spieltags
        ergebnisDaten = Array.from(spiele, spiel => {
            if (spiel.toreHeim === -1) {
                return createCell('---')
            } else {
                return createCell(spiel.toreHeim + ':' + spiel.toreGast);
            }
        })
        
        datumDaten = Array.from(spiele, spiel => createCell(formatDatum(spiel.datum)));
        heimDaten = Array.from(spiele, spiel => createCell(data.mannschaften[spiel.heim].name));
        gastDaten = Array.from(spiele, spiel => createCell(data.mannschaften[spiel.gast].name));
    }

    // Überschrift davorsetzen
    datumDaten.unshift(createCell('Datum'));
    heimDaten.unshift(createCell('Heimmannschaft'));
    ergebnisDaten.unshift(createCell('Ergebnis'));
    gastDaten.unshift(createCell('Gastmannschaft'));
  
    // Tabellenspalten aktualisieren
    node
        .querySelector('.spieltag [data-type="datum"]')
        .replaceChildren(...datumDaten);
    node
        .querySelector('.spieltag [data-type="heim"]')
        .replaceChildren(...heimDaten);
    node
        .querySelector('.spieltag [data-type="ergebnis"]')
        .replaceChildren(...ergebnisDaten);
    node
        .querySelector('.spieltag [data-type="gast"]')
        .replaceChildren(...gastDaten);
}

function vorigerSpieltag() {
    if (data.aktuellerSpieltag > 0) {
        data.aktuellerSpieltag -= 1;
        fillTabelle();
        fillSpieltag();
    }
}

function naechsterSpieltag() {
    if (data.aktuellerSpieltag < data.anzahlSpieltage - 1) {
        data.aktuellerSpieltag += 1;
        fillTabelle();
        fillSpieltag();
    }
}
