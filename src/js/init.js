import { randomDate, randomInt, randomBool, shuffle, formatDatum } from './utils.js';
import { data, aktuelleSaison, istSpieltag, getSpieltagIndex, getLetztenSpieltagIndex } from './data.js';
import { show as showUebersicht } from './spieltag/uebersicht.js';
import { show as showAufstellung } from './spieltag/aufstellung.js';
import { show as showLetztesSpiel } from './spieltag/letztesSpiel.js';

export async function init() {
    document.querySelector('div.rechte-seite #managername').textContent = data.manager.name;
    document.querySelector('div.rechte-seite #aktuellesdatum').textContent = formatDatum(data.aktuellesDatum);
    document.querySelector('#naechsterTag').addEventListener('click', naechsterTag);
    document.querySelector('#spieleSpieltag').addEventListener('click', spieleSpieltag);

    await initData();

    fuegeSpielerZuMannschaftenHinzu();
    erstelleStartelfs();
    erzeugeSaisons();
}

async function initData() {
    data.mannschaften = await (
        await fetch("http://localhost:8080/js/mannschaften.json")
    ).json();
    data.spieltage = await (
        await fetch("http://localhost:8080/js/spieltage.json")
    ).json();
    data.anzahlMannschaften = Object.keys(data.mannschaften).length;
    data.anzahlSpieltage = (data.anzahlMannschaften - 1) * 2;
    data.namen = await (
        await fetch("http://localhost:8080/js/namen.json")
    ).json();
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
        mannschaft.spielerNachRueckennummer = {};

        // drei Torhüter, 15 Feldspieler
        for (let i = 0; i < 18; i++) {
            mannschaft.spieler.push(erzeugeSpieler(rueckennummern[i], startDate, endDate, i < 3));
            mannschaft.spielerNachRueckennummer[rueckennummern[i]] = mannschaft.spieler[mannschaft.spieler.length - 1]
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

function erzeugeSaisons() {
    data.saisons = {
        2022: {
        saison: "2022/2023",
        startdatum: new Date("2022-08-06T13:30:00Z"),
        spieltage: {}
        }
    };

    const saison = aktuelleSaison();
    let datum = saison.startdatum;

    for (let spieltagIndex = 0; spieltagIndex < data.anzahlSpieltage; spieltagIndex++) {
        const spieltag = {
            spiele: {}
        };
        saison.spieltage[spieltagIndex] = spieltag;

        const spieltagspaarungen = data.spieltage[spieltagIndex];
        for (let spielIndex = 0; spielIndex < spieltagspaarungen.length; spielIndex++) {
            spieltag.spiele[spielIndex] = {
                datum: new Date(datum),
                heim: spieltagspaarungen[spielIndex].heim,
                gast: spieltagspaarungen[spielIndex].gast,
                toreHeim: -1,
                toreGast: -1
            };
        }

        datum.setDate(datum.getDate() + 7);
    }
}

function spielSpielen(heimindex, gastindex) {
    const HEIM = true
    const GAST = false
    const HEIMDRITTEL = 0;
    const MITTELFELD = 1;
    const GASTDRITTEL = 2;
    const OFFENSIVE_GRENZE = 0.25; // muss < 1.0 sein
    const DEFENSIVE_GRENZE = 0.75; // muss < 1.0 sein

    const heimmannschaft = data.mannschaften[heimindex]
    const gastmannschaft = data.mannschaften[gastindex]

    const heimAngriff =
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LA].spielstaerke.angriff +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RA].spielstaerke.angriff;
    const heimMittelfeld =
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LM].spielstaerke.mittelfeld +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LZM].spielstaerke.mittelfeld +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RZM].spielstaerke.mittelfeld +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RM].spielstaerke.mittelfeld;
    const heimVerteidigung =
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LV].spielstaerke.verteidigung +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LIV].spielstaerke.verteidigung +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RIV].spielstaerke.verteidigung +
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RV].spielstaerke.verteidigung;
    const heimTor =
        heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.TW].spielstaerke.tor;

    const gastAngriff =
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LA].spielstaerke.angriff +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RA].spielstaerke.angriff;
    const gastMittelfeld =
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LM].spielstaerke.mittelfeld +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LZM].spielstaerke.mittelfeld +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RZM].spielstaerke.mittelfeld +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RM].spielstaerke.mittelfeld;
    const gastVerteidigung =
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LV].spielstaerke.verteidigung +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LIV].spielstaerke.verteidigung +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RIV].spielstaerke.verteidigung +
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RV].spielstaerke.verteidigung;
    const gastTor =
        gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.TW].spielstaerke.tor;

    // Team ermitteln, das Anstoß hat
    // 10 Ballaktionen pro Minute simulieren
    // nach Anpfiff beginnt es im Mittelfeld

    // Ball im Heimdrittel
    // - vergleiche heimVerteidigung mit gastAngriff
    // - verwende einen kleinen Zufallsfaktor
    //     const random = randomInt(0, heimVerteidigung + gastAngriff);
    //     const sieger = random < heimVerteidigung ? "Heim" : "Gast";
    // - wenn die ballführende Mannschaft deutlicher Sieger ist, und ...
    //     - die Heimmannschaft den Ball hat, dann wird der Ball ins Mittelfeld gespielt
    //     - die Gastmannschaft den Ball hat, dann erfolgt ein Torabschluss
    //         - ein Angreifer der Gastmannschaft wird zufällig ausgewählt (LA oder RA)
    //         - er geht ins 1:1 gegen den Torwart der Heimmannschaft (selbes Stärke+Zufall-Prinzip wie oben)
    //             - wenn der Angreifer deutlicher Sieger ist, schießt er ein Tor, die Gastmannschaft bekommt ein Tor, die Heimmannschaft den Ball im Mittelfeld
    //             - wenn der Angreifer deutlicher Verlierer ist, hält der Torwart den Ball fest, der Ballbesitz wechselt, die Ballposition ist aber noch das Heimdrittel
    //             - ansonsten wehrt der Torwart den Schuss ab, die Gastmannschaft bleibt aber im Ballbesitz
    // - wenn die ballführende Mannschaft deutlicher Verlierer ist, dann wechselt der Ballbesitz, bleibt aber im aktuellen Spielfelddrittel
    // - ansonsten bleibt sie im aktuellen Spielfelddrittel in Ballbesitz

    // Ball im Mittelfeld
    // - vergleiche heimMittelfeld mit gastMittelfeld
    // - verwende einen kleinen Zufallsfaktor
    //     const random = randomInt(0, heimstaerke + gaststaerke);
    //     const sieger = random < heimstaerke ? "Heim" : "Gast";
    // - wenn die ballführende Mannschaft deutlicher Sieger ist, dann wird der Ball ins nächste Spielfelddrittel gespielt
    // - wenn die ballführende Mannschaft deutlicher Verlierer ist, dann wechselt der Ballbesitz, bleibt aber im aktuellen Spielfelddrittel
    // - ansonsten bleibt sie im aktuellen Spielfelddrittel in Ballbesitz

    // Ball im Gastdrittel
    // - wie "Ball im Heimdrittel", nur umgekehrt

    // Initialisierung
    let ballposition = MITTELFELD;
    let heimtore = 0
    let gasttore = 0
    let ballbesitz = randomBool(); // Wer hat Anstoß?

    for (let i = 0; i < 2; i++) { // zwei Halbzeiten
        ballbesitz = !ballbesitz; // jeder hat einmal Anstoß
        for (let j = 0; j < 45 * 10; j++) { // je 45 Minuten, je zehn Ballaktionen pro Minute
            if (ballposition === HEIMDRITTEL) {
                const random = randomInt(0, heimVerteidigung + gastAngriff);
                if (ballbesitz === HEIM) {
                    if (random < heimVerteidigung * OFFENSIVE_GRENZE) {
                        // |--Heimverteidigung---||--Gastangriff--------|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Heimmannschaft im eigenen Drittel in Ballbesitz, Pass nach Vorne
                        // Ballbesitz bleibt, Ballposition verschiebt ins Mittelfeld
                        ballposition = MITTELFELD;
                    } else if (random < heimVerteidigung) {
                        // |--Heimverteidigung---||--Gastangriff--------|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Heimmannschaft im eigenen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < heimVerteidigung + gastAngriff * DEFENSIVE_GRENZE) {
                        // |--Heimverteidigung---||--Gastangriff--------|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Heimmannschaft im eigenen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Heimverteidigung---||--Gastangriff--------|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Heimmannschaft verliert den Ball im eigenen Drittel
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = GAST;
                    }
                } else if (ballbesitz === GAST) {
                    if (random < gastAngriff * OFFENSIVE_GRENZE) {
                        // |--Gastangriff--------||--Heimverteidigung---|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Gastmannschaft im gegnerischen Drittel in Ballbesitz, Torschuss
                        // Ballbesitzt und Ballposition hängen vom Torerfolg ab
                        const angreiferStaerke = randomBool() ?
                            gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.LA].spielstaerke.angriff :
                            gastmannschaft.spielerNachRueckennummer[gastmannschaft.startelf.RA].spielstaerke.angriff;
                        const torschuss = randomInt(0, angreiferStaerke + heimTor);
                        if (torschuss < angreiferStaerke * OFFENSIVE_GRENZE) {
                            // Gastmannschaft erzielt Tor
                            // Ballbesitz wechselt, Ballposition verschiebt ins Mittelfeld
                            gasttore++;
                            ballposition = MITTELFELD;
                            ballbesitz = HEIM;
                        } else if (torschuss < angreiferStaerke) {
                            // Heimtorwart hält, aber Gastmannschaft erobert den zweiten Ball
                            // Ballbesitz bleibt, Ballposition bleibt
                        } else if (torschuss < angreiferStaerke + heimTor * DEFENSIVE_GRENZE) {
                            // Heimtorwart hält, aber Gastmannschaft erobert den zweiten Ball
                            // Ballbesitz bleibt, Ballposition bleibt
                        } else {
                            // Heimtorwart hält den Ball fest
                            // Ballbesitz wechselt, Ballposition bleibt
                            ballbesitz = HEIM;
                        }
                    } else if (random < gastAngriff) {
                        // |--Gastangriff--------||--Heimverteidigung---|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Gastmannschaft im gegnerischen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < gastAngriff + heimVerteidigung * DEFENSIVE_GRENZE) {
                        // |--Gastangriff--------||--Heimverteidigung---|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Gastmannschaft im gegnerischen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Gastangriff--------||--Heimverteidigung---|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Gastmannschaft verliert den Ball im eigenen Drittel
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = HEIM;
                    }
                }
            } else if (ballposition === MITTELFELD) {
                const random = randomInt(0, heimMittelfeld + gastMittelfeld);
                if (ballbesitz === HEIM) {
                    if (random < heimMittelfeld * OFFENSIVE_GRENZE) {
                        // |--Heimmittelfeld-----||--Gastmittelfeld-----|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Heimmannschaft im Mittelfeld in Ballbesitz, Pass nach Vorne
                        // Ballbesitz bleibt, Ballposition verschiebt ins Gastdrittel
                        ballposition = GASTDRITTEL;
                    } else if (random < heimMittelfeld) {
                        // |--Heimmittelfeld-----||--Gastmittelfeld-----|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Heimmannschaft im Mittelfeld in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < heimMittelfeld + gastMittelfeld * DEFENSIVE_GRENZE) {
                        // |--Heimmittelfeld-----||--Gastmittelfeld-----|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Heimmannschaft im Mittelfeld in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Heimmittelfeld-----||--Gastmittelfeld-----|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Heimmannschaft verliert den Ball im Mittelfeld
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = GAST;
                    }
                } else if (ballbesitz === GAST) {
                    if (random < gastMittelfeld * OFFENSIVE_GRENZE) {
                        // |--Gastmittelfeld-----||--Heimmittelfeld-----|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Gastmannschaft im Mittelfeld in Ballbesitz, Pass nach Vorne
                        // Ballbesitz bleibt, Ballposition verschiebt ins Heimdrittel
                        ballposition = HEIMDRITTEL;
                    } else if (random < gastMittelfeld) {
                        // |--Gastmittelfeld-----||--Heimmittelfeld-----|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Gastmannschaft im Mittelfeld in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < gastMittelfeld + heimMittelfeld * DEFENSIVE_GRENZE) {
                        // |--Gastmittelfeld-----||--Heimmittelfeld-----|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Gastmannschaft im Mittelfeld in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Gastmittelfeld-----||--Heimmittelfeld-----|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Gastmannschaft verliert den Ball im Mittelfeld
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = HEIM;
                    }
                }
            } else if (ballposition === GASTDRITTEL) {
                const random = randomInt(0, gastVerteidigung + heimAngriff);
                if (ballbesitz === HEIM) {
                    if (random < heimAngriff * OFFENSIVE_GRENZE) {
                        // |--Heimangriff--------||--Gastverteidigung---|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Heimmannschaft im gegnerischen Drittel in Ballbesitz, Torschuss
                        // Ballbesitzt und Ballposition hängen vom Torerfolg ab
                        const angreiferStaerke = randomBool() ?
                            heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.LA].spielstaerke.angriff :
                            heimmannschaft.spielerNachRueckennummer[heimmannschaft.startelf.RA].spielstaerke.angriff;
                        const torschuss = randomInt(0, angreiferStaerke + gastTor);
                        if (torschuss < angreiferStaerke * OFFENSIVE_GRENZE) {
                            // Heimmannschaft erzielt Tor
                            // Ballbesitz wechselt, Ballposition verschiebt ins Mittelfeld
                            heimtore++;
                            ballposition = MITTELFELD;
                            ballbesitz = GAST;
                        } else if (torschuss < angreiferStaerke) {
                            // Gasttorwart hält, aber Heimmannschaft erobert den zweiten Ball
                            // Ballbesitz bleibt, Ballposition bleibt
                        } else if (torschuss < angreiferStaerke + gastTor * DEFENSIVE_GRENZE) {
                            // Gasttorwart hält, aber Heimmannschaft erobert den zweiten Ball
                            // Ballbesitz bleibt, Ballposition bleibt
                        } else {
                            // Gasttorwart hält den Ball fest
                            // Ballbesitz wechselt, Ballposition bleibt
                            ballbesitz = GAST;
                        }
                    } else if (random < heimAngriff) {
                        // |--Heimangriff--------||--Gastverteidigung---|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Heimmannschaft im gegnerischen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < heimAngriff + gastVerteidigung * DEFENSIVE_GRENZE) {
                        // |--Heimangriff--------||--Gastverteidigung---|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Heimmannschaft im gegnerischen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Heimangriff--------||--Gastverteidigung---|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Heimmannschaft verliert den Ball im eigenen Drittel
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = GAST;
                    }
                } else if (ballbesitz === GAST) {
                    if (random < gastVerteidigung * OFFENSIVE_GRENZE) {
                        // |--Gastverteidigung---||--Heimangriff--------|
                        // |oooooooooo|----------||----------|----------|          random liegt im ersten Viertel
                        // Gastmannschaft im eigenen Drittel in Ballbesitz, Pass nach Vorne
                        // Ballbesitz bleibt, Ballposition verschiebt ins Mittelfeld
                        ballposition = MITTELFELD;
                    } else if (random < gastVerteidigung) {
                        // |--Gastverteidigung---||--Heimangriff--------|
                        // |----------|oooooooooo||----------|----------|          random liegt im zweiten Viertel
                        // Gastmannschaft im eigenen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else if (random < gastVerteidigung + heimAngriff * DEFENSIVE_GRENZE) {
                        // |--Gastverteidigung---||--Heimangriff--------|
                        // |----------|----------||oooooooooo|----------|          random liegt im dritten Viertel
                        // Gastmannschaft im eigenen Drittel in Ballbesitz, Querpass
                        // Ballbesitz bleibt, Ballposition bleibt
                    } else {
                        // |--Gastverteidigung---||--Heimangriff--------|
                        // |----------|----------||----------|oooooooooo|          random liegt im vierten Viertel
                        // Gastmannschaft verliert den Ball im eigenen Drittel
                        // Ballbesitz wechselt, Ballposition bleibt
                        ballbesitz = HEIM;
                    }
                }
            }
        }
    }

    return [heimtore, gasttore]
}

function spieleSpieltag() {
    const saison = aktuelleSaison();
    const spieltagIndex = getSpieltagIndex(data.aktuellesDatum);
    const spieltagspaarungen = data.spieltage[spieltagIndex];
    
    for (const [spielIndex, spiel] of Object.entries(saison.spieltage[spieltagIndex].spiele)) {
        const [heimtore, gasttore] = spielSpielen(spieltagspaarungen[spielIndex].heim, spieltagspaarungen[spielIndex].gast)
        spiel.toreHeim = heimtore;
        spiel.toreGast = gasttore;

        if (spiel.heim === data.manager.mannschaft || spiel.gast === data.manager.mannschaft) {
            data.letztesSpiel = spiel;
        }
    }

    document.querySelector('#naechsterTag').style.display = 'block';
    document.querySelector('#spieleSpieltag').style.display = 'none';

    data.aktuellerSpieltag = getLetztenSpieltagIndex(data.aktuellesDatum);
    
    showLetztesSpiel();
}

function naechsterTag() {
    data.aktuellesDatum.setDate(data.aktuellesDatum.getDate() + 1);
    document.querySelector('div.rechte-seite #aktuellesdatum').textContent = formatDatum(data.aktuellesDatum);
    if (istSpieltag(data.aktuellesDatum)) {
        showAufstellung();
        document.querySelector('#naechsterTag').style.display = 'none';
        document.querySelector('#spieleSpieltag').style.display = 'block';
    } else {
        showUebersicht();
    }
}
