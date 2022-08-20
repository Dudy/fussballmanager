# Fussball Manager

## Datenmodell

Das Datenmodell liegt global vor in der Datei `data.js`. Es ist ist **kein** serialisiertes (stringified) Objekt,
es enthält Javascript-Unterobjekte. Das Format sieht etwa so aus:

### Data
```javascript
{
    aktuellesDatum: <date>,
    manager: {
        name: <string>,
        mannschaft: <number>
    },
    saisons: [
        <number, format "numerische ID", description "Jahr">: {
            saison: <string, format "Anfangsjahr/Endjahr", example "2022/2023">,
            startdatum: <date>,
            spieltage: {
                <string, format "numerische ID">: {
                    spiele: {
                        <string, format "numerische ID">: {
                            datum: <date>,
                            heim: <number>,
                            gast: <number>,
                            toreHeim: <number>,
                            toreGast: <number>,
                            statistik: [
                                {
                                    halbzeit: <number, format "0 oder 1">,
                                    minute: <number, format "0 bis 90">,
                                    ballbesitzVorher: <boolean, format "Heim = true, Gast = false">,
                                    ballbesitzNachher: <boolean, s.o.>,
                                    ballpositionVorher: <string, enum "Heimdrittel, Mittelfeld oder Gastdrittel">,
                                    ballpositionNachher: <string, s.o.>,
                                    text: <string>,
                                    level: <number, format "0 bis 4", description "0 = wenig Ausgabe, 4 = sehr viel Ausgabe">
                                }
                            ]
                        }
                    }
                }
            }
        }
    ],
    aktuelleSaison: <number>,
    aktuellerSpieltag: <number>,
    statistiklevel: <number>,
    mannschaften: {
        <string, format "numerische ID">: {
            name: <string>,
            startelf: {
                LA: <string, description "Rückennummer des Spielers">, RA: <string>,
                LM: <string>, LZM: <string>, RZM: <string>, RM: <string>,
                LV: <string>, LIV: <string>, RIV: <string>, RV: <string>,
                TW: <string>
            },
            spieler: [
                {
                    rueckennummer: <number>,
                    name: <string>,
                    spielstaerke: {
                        tor: <number, range(0..100)>,
                        verteidigung: <number, range(0..100)>,
                        mittelfeld: <number, range(0..100)>,
                        angriff: <number, range(0..100)>
                    },
                    geburtsdatum: <date>,
                    trainingsfokus: <string, enum "tor, verteidigung, mittelfeld, angriff">,
                    trainingsfortschritt {
                        tor: <number, range(0..100)>,
                        verteidigung: <number, range(0..100)>,
                        mittelfeld: <number, range(0..100)>,
                        angriff: <number, range(0..100)>
                    }
                },
                { ... },
                ...
                { ... }
            ],
            spielerNachRueckennummer: {
                <string, format "numerische ID", description "Rückennummer">: <spieler, siehe voriges Array>
            }
        }
    },
    spieltage: [
        [
            { heim: <number>, gast: <number> },
            { heim: <number>, gast: <number> },
            ...
            { heim: <number>, gast: <number> }
        ],
        [ ... ],
        ...
        [ ... ]
    ],
    anzahlMannschaften: <number>,
    anzahlSpieltage: <number>,
    namen: {
        vornamen: [ <string>, <string> ... <string> ],
        nachnamen: [ <string>, <string> ... <string> ]
    },
    letztesSpiel: <Spiel, description "siehe data.saisons.<number>.spieltage.<number>.spiele.<number>">
}
```

### Beschreibung der Felder

- aktuellesDatum: Das ist ein ISO-8601 Datum, das während der Initialisierung angelegt wird.
- TODO

## Was passiert beim Tageswechsel?

- Datenaktualisierungen
  - Das Datum erhöht sich um einen Tag.
  - Alle Spiele mit Datum gestriger Tag werden absolviert. Das beinhaltet *nicht* das Spiel (`data.letztesSpiel`), dass der Manager möglicherweise
    gestern hatte, denn das wurde ja bereits beim Klick auf "Spiel austragen" gemacht.
- UI Aktualisierungen
  - Das Datum oben rechts auf der oberen Navigationsleiste wird aktualisiert.
  - Wenn heute ein Spieltag ist, wechselt die Ansicht zur "Aufstellung".
  - Wenn heute kein Spieltag ist, wechselt die Ansicht zur "Übersicht".
