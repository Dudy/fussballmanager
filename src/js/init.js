import { randomDate, randomInt } from './utils.js'
import { data } from './data.js'

export async function init() {
    data.mannschaften = await (
        await fetch("http://localhost:8080/js/mannschaften.json")
    ).json()
    data.anzahlMannschaften = Object.keys(data.mannschaften).length
    data.anzahlSpieltage = (data.anzahlMannschaften - 1) * 2
    data.aktuelleSaison = 2022
    data.aktuellerSpieltag = -1
    data.namen = await (
        await fetch("http://localhost:8080/js/namen.json")
    ).json()
    data.saisons = []

    fuegeSpielerZuMannschaftenHinzu()
    erzeugeSaisons()
}

function erzeugeSpieler(startDate, endDate, istTorwart) {
    return {
        name:
            data.namen.vornamen[randomInt(0, data.namen.vornamen.length)] +
            " " +
            data.namen.nachnamen[randomInt(0, data.namen.nachnamen.length)],
        spielstaerke: {
            tor: istTorwart ? randomInt(30, 100) : randomInt(0, 30),
            verteidigung: istTorwart ? randomInt(0, 30) : randomInt(30, 100),
            mittelfeld: istTorwart ? randomInt(0, 30) : randomInt(30, 100),
            angriff: istTorwart ? randomInt(0, 30) : randomInt(30, 100),
        },
        geburtsdatum: randomDate(startDate, endDate)
    }
}

function fuegeSpielerZuMannschaftenHinzu() {
    const today = new Date()
    const startDate = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 40) // max. 40 Jahre alt
    const endDate = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 16) // min. 16 Jahre alt
    const TORWART = true
    const FELDSPIELER = false

    for (const mannschaft of Object.values(data.mannschaften)) {
        mannschaft.spieler = []

        // drei Torhüter
        for (let i = 0; i < 3; i++) {
            mannschaft.spieler.push(erzeugeSpieler(startDate, endDate, TORWART))
        }

        // 15 Feldspieler
        for (let i = 0; i < 15; i++) {
            mannschaft.spieler.push(erzeugeSpieler(startDate, endDate, FELDSPIELER))
        }
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
    const spieltag = spieltagNullBasiert + 1
    const alleMannschaften = [...Array(data.anzahlMannschaften).keys()]
    // 0-Item rauswerfen
    alleMannschaften.shift()

    let mannschaft1
    let mannschaft2
    const grenze = Math.ceil(spieltag / 2)
    const spiele = []
    const offset = data.anzahlMannschaften - 1
    const jokerHeimgrenze = (data.anzahlMannschaften - 2) / 2

    while (alleMannschaften.length > 1) {
        mannschaft1 = alleMannschaften.shift()
        mannschaft2 = spieltag - mannschaft1
        if (mannschaft1 === mannschaft2) {
            alleMannschaften.push(mannschaft1)
            continue
        }
        if (mannschaft1 >= grenze) {
            mannschaft2 += offset
        }
        alleMannschaften.splice(alleMannschaften.indexOf(mannschaft2), 1)
        spiele.push({
            heim:
                ((mannschaft1 + mannschaft2) % 2 === 0
                    ? Math.max(mannschaft1, mannschaft2)
                    : Math.min(mannschaft1, mannschaft2)) - 1,
            gast:
                ((mannschaft1 + mannschaft2) % 2 === 0
                    ? Math.min(mannschaft1, mannschaft2)
                    : Math.max(mannschaft1, mannschaft2)) - 1
        })
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
    })

    return spiele
}

function erzeugeSaisons() {
    data.saisons = {
        2022: {
        saison: "2022/2023",
        startdatum: new Date("2022-08-06T13:30:00Z"),
        spieltage: {}
        }
    }

    const saisonIndex = 2022
    const saison = data.saisons[saisonIndex]

    let datum = saison.startdatum

    for (let spieltagIndex = 0; spieltagIndex < data.anzahlSpieltage; spieltagIndex++) {
        const spieltag = {
            spiele: {}
        }
        saison.spieltage[spieltagIndex] = spieltag

        const spieltagspaarungen = erzeugeSpieltagspaarungen(spieltagIndex)
        for (let spielIndex = 0; spielIndex < spieltagspaarungen.length; spielIndex++) {
            spieltag.spiele[spielIndex] = {
                datum: datum.toISOString(),
                heim: spieltagspaarungen[spielIndex].heim,
                gast: spieltagspaarungen[spielIndex].gast,
                toreHeim: randomInt(0, 4),
                toreGast: randomInt(0, 4)
            }
        }

        datum.setDate(datum.getDate() + 7)
    }
}
