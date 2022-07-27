const mannschaften = {
  0: {
    name: "Arminia Bielefeld"
  },
  1: {
    name: "1. FSV Mainz 05"
  },
  2: {
    name: "VfB Stuttgart"
  },
  3: {
    name: "1. FC Kaiserslautern"
  },
  4: {
    name: "Borussia Dortmund"
  },
  5: {
    name: "Borussia Mönchengladbach"
  },
  6: {
    name: "Bayer 04 Leverkusen"
  },
  7: {
    name: "Hertha BSC"
  },
  8: {
    name: "1. FC Nürnberg"
  },
  9: {
    name: "Hannover 96"
  },
  10: {
    name: "Eintracht Frankfurt"
  },
  11: {
    name: "FC Bayern München"
  },
  12: {
    name: "VfL Wolfsburg"
  },
  13: {
    name: "FC Schalke 04"
  },
  14: {
    name: "MSV Duisburg"
  },
  15: {
    name: "1. FC Köln"
  },
  16: {
    name: "Werder Bremen"
  },
  17: {
    name: "Hamburger SV"
  }
}

const anzahlMannschaften = Object.keys(mannschaften).length
const anzahlSpieleProSpieltag = anzahlMannschaften / 2
const anzahlSpieltage = (anzahlMannschaften - 1) * 2
let aktuelleSaison = 2022
let aktuellerSpieltag = -1

function formatDatum(datum) {
  if (datum instanceof Date) {
    return datum.toLocaleDateString("DE-de", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  } else {
    return formatDatum(new Date(datum))
  }
}

function createTestspiele() {
  const saisonList = {
    2022: {
      saison: "2022/2023",
      spieltage: {}
    }
  }

  const saisonIndex = 2022
  const saison = saisonList[saisonIndex]

  let datum = new Date("2022-08-06T13:30:00Z")

  for (
    let spieltagIndex = 0;
    spieltagIndex < anzahlSpieltage;
    spieltagIndex++
  ) {
    const spieltag = {
      spiele: {}
    }
    saison.spieltage[spieltagIndex] = spieltag

    for (
      let spielIndex = 0;
      spielIndex < anzahlSpieleProSpieltag;
      spielIndex++
    ) {
      const indexHeim = Math.floor(Math.random() * anzahlMannschaften)
      let indexGast = Math.floor(Math.random() * anzahlMannschaften)
      while (indexGast === indexHeim) {
        indexGast = Math.floor(Math.random() * anzahlMannschaften)
      }

      spieltag.spiele[spielIndex] = {
        datum: datum.toISOString(),
        heim: indexHeim,
        gast: indexGast,
        toreHeim: Math.floor(Math.random() * 4),
        toreGast: Math.floor(Math.random() * 4)
      }
    }

    datum.setDate(datum.getDate() + 7)
  }

  return saisonList
}

function erzeugeSaisons() {
  const saisonList = {
    2022: {
      saison: "2022/2023",
      startdatum: new Date("2022-08-06T13:30:00Z"),
      spieltage: {}
    }
  }

  const saisonIndex = 2022
  const saison = saisonList[saisonIndex]

  let datum = saison.startdatum

  for (let spieltagIndex = 0; spieltagIndex < anzahlSpieltage; spieltagIndex++) {
    const spieltag = {
      spiele: {}
    }
    saison.spieltage[spieltagIndex] = spieltag

    const spieltagspaarungen = erzeugeSpieltagspaarungen(spieltagIndex)
    for (let spielIndex = 0; spielIndex < anzahlSpieleProSpieltag; spielIndex++) {
      spieltag.spiele[spielIndex] = {
        datum: datum.toISOString(),
        heim: spieltagspaarungen[spielIndex].heim,
        gast: spieltagspaarungen[spielIndex].gast,
        toreHeim: Math.floor(Math.random() * 4),
        toreGast: Math.floor(Math.random() * 4)
      }
    }

    datum.setDate(datum.getDate() + 7)
  }

  return saisonList
}

function addSpieltagToTabelle(tabelle, spieltag) {  
  for (const id of Object.keys(spieltag.spiele)) {
    const spiel = spieltag.spiele[id]

    const mannschaftHeim = tabelle.mannschaften[spiel.heim]
    mannschaftHeim.spiele += 1
    mannschaftHeim.tore += spiel.toreHeim
    mannschaftHeim.gegentore += spiel.toreGast
    if (spiel.toreHeim > spiel.toreGast) {
      mannschaftHeim.punkte += 3
    } else if (spiel.toreHeim === spiel.toreGast) {
      mannschaftHeim.punkte += 1
    }

    const mannschaftGast = tabelle.mannschaften[spiel.gast]
    mannschaftGast.spiele += 1
    mannschaftGast.tore += spiel.toreGast
    mannschaftGast.gegentore += spiel.toreHeim
    if (spiel.toreGast > spiel.toreHeim) {
      mannschaftGast.punkte += 3
    } else if (spiel.toreGast === spiel.toreHeim) {
      mannschaftGast.punkte += 1
    }
  }
}

function mannschaftComparator(mannschaft0, mannschaft1) {
  if (mannschaft0.punkte > mannschaft1.punkte) {
    return -1
  } else if (mannschaft0.punkte < mannschaft1.punkte) {
    return 1
  } else {
    const tordifferenz0 = mannschaft0.tore - mannschaft0.gegentore
    const tordifferenz1 = mannschaft1.tore - mannschaft1.gegentore

    if (tordifferenz0 > tordifferenz1) {
      return -1
    } else if (tordifferenz0 < tordifferenz1) {
      return 1
    } else {
      if (mannschaft0.tore > mannschaft1.tore) {
        return -1
      } else if (mannschaft0.tore < mannschaft1.tore) {
        return 1
      } else {
        return 0
      }
    }
  }
}

function createCell(text) {
  const cellNode = document.createElement("cell")
  const textNode = document.createTextNode(text)
  cellNode.appendChild(textNode)
  return cellNode
}

function fillTabelle() {
  const spieltage = saisons[aktuelleSaison].spieltage

  const tabelle = {
    spieltag: 0,
    mannschaften: []
  }
  for (const id of Object.keys(mannschaften)) {
    tabelle.mannschaften.push({
      id: id,
      spiele: 0,
      tore: 0,
      gegentore: 0,
      punkte: 0
    })
  }

  let platzDaten = [...Array(18).keys()].map((i) => createCell(i + 1 + "."))
  let nameDaten
  let spieleDaten
  let toreDaten
  let punkteDaten

  // Daten ermitteln als ...
  if (aktuellerSpieltag === -1) {
    // ... Initialbefüllung, wenn vor dem ersten Spieltag
    nameDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell("0"))
    toreDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell("0:0"))
    punkteDaten = Array.from({ length: tabelle.mannschaften.length }, () => createCell("0"))
  } else {
    // ... berechnetem aktuellen Tabellenstand, wenn an einem gegebenen Spieltag

    // Hier wird jedesmal von Vorne begonnen, die Tabelle komplett neu aufzubauen. Man könnte auch nur
    // beim Blättern (voriger/nächster Spieltag) jeweils einen Spieltag weg oder dazu nehmen, aber dann
    // könnte man nicht zu einem beliebigen Spieltag springen (z.B. per deep link).
    // Da das ganze praktisch keine Zeit kostet ("duration: 0ms") lasse ich das einfach so.
    for (let i = 0; i <= aktuellerSpieltag; i++) {
      addSpieltagToTabelle(tabelle, spieltage[i])
    }
    tabelle.mannschaften.sort(mannschaftComparator)

    // Nach der Berechnung der Tabelle des aktuellen Spieltags kann man jetzt einfach die Daten rausmappen.
    nameDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.spiele))
    toreDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.tore + ":" + mannschaft.gegentore))
    punkteDaten = Array.from(tabelle.mannschaften, (mannschaft) => createCell(mannschaft.punkte))
  }

  // Überschrift davorsetzen
  platzDaten.unshift(createCell("Platz"))
  nameDaten.unshift(createCell("Name"))
  spieleDaten.unshift(createCell("Spiele"))
  toreDaten.unshift(createCell("Tore"))
  punkteDaten.unshift(createCell("Punkte"))

  // Tabellenspalten aktualisieren
  document
    .querySelector('.tabelle [data-type="platz"]')
    .replaceChildren(...platzDaten)
  document
    .querySelector('.tabelle [data-type="name"]')
    .replaceChildren(...nameDaten)
  document
    .querySelector('.tabelle [data-type="spiele"]')
    .replaceChildren(...spieleDaten)
  document
    .querySelector('.tabelle [data-type="tore"]')
    .replaceChildren(...toreDaten)
  document
    .querySelector('.tabelle [data-type="punkte"]')
    .replaceChildren(...punkteDaten)
}

function fillSpieltag() {
  const spieltage = saisons[aktuelleSaison].spieltage

  // im Code ist der erste Spieltag am Index 0, aber wir zeigen auf der UI natürlich "1" an
  document
    .querySelector(".spieltag p2 span")
    .textContent = aktuellerSpieltag + 1

  let datumDaten
  let heimDaten
  let ergebnisDaten
  let gastDaten
  let spiele

  // Daten ermitteln aus ...
  if (aktuellerSpieltag === -1) {
    // ... den Spielen des ersten Spieltags, aber ohne die Ergebnisse
    spiele = Object.values(spieltage[aktuellerSpieltag + 1].spiele)
    datumDaten = Array.from(spiele, spiel => createCell(formatDatum(spiel.datum)))
    heimDaten = Array.from(spiele, spiel => createCell(mannschaften[spiel.heim].name))
    ergebnisDaten = Array.from(spiele, () => createCell('---'))
    gastDaten = Array.from(spiele, spiel => createCell(mannschaften[spiel.gast].name))
  } else {
    // ... den Spielen des gewählten Spieltags
    spiele = Object.values(spieltage[aktuellerSpieltag].spiele)
    ergebnisDaten = Array.from(spiele, spiel => createCell(spiel.toreHeim + ':' + spiel.toreGast))
    datumDaten = Array.from(spiele, spiel => createCell(formatDatum(spiel.datum)))
    heimDaten = Array.from(spiele, spiel => createCell(mannschaften[spiel.heim].name))
    gastDaten = Array.from(spiele, spiel => createCell(mannschaften[spiel.gast].name))
  }

  // Überschrift davorsetzen
  datumDaten.unshift(createCell('Datum'))
  heimDaten.unshift(createCell('Heimmannschaft'))
  ergebnisDaten.unshift(createCell('Ergebnis'))
  gastDaten.unshift(createCell('Gastmannschaft'))

  // Tabellenspalten aktualisieren
  document
    .querySelector('.spieltag [data-type="datum"]')
    .replaceChildren(...datumDaten)
  document
    .querySelector('.spieltag [data-type="heim"]')
    .replaceChildren(...heimDaten)
  document
    .querySelector('.spieltag [data-type="ergebnis"]')
    .replaceChildren(...ergebnisDaten)
  document
    .querySelector('.spieltag [data-type="gast"]')
    .replaceChildren(...gastDaten)
}

function vorigerSpieltag() {
  if (aktuellerSpieltag > -1) {
    aktuellerSpieltag -= 1
    fillTabelle()
    fillSpieltag()
  }
}

function naechsterSpieltag() {
  if (aktuellerSpieltag < anzahlSpieltage - 1) {
    aktuellerSpieltag += 1
    fillTabelle()
    fillSpieltag()
  }
}

function addEventHandler() {
  document
    .getElementById("voriger-spieltag")
    .addEventListener("click", vorigerSpieltag)
  document
    .getElementById("naechster-spieltag")
    .addEventListener("click", naechsterSpieltag)
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

  const alleMannschaften = [...Array(anzahlMannschaften).keys()]
  alleMannschaften.shift()
  let mannschaft1
  let mannschaft2
  const grenze = Math.ceil(spieltag / 2)
  const spiele = []
  const offset = anzahlMannschaften - 1
  const jokerHeimgrenze = (anzahlMannschaften - 2) / 2

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

addEventHandler()

const saisons = erzeugeSaisons()
fillTabelle()
fillSpieltag()
