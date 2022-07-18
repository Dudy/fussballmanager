const mannschaften = {
  0: {
    name: "Bayern München"
  },
  1: {
    name: "Borussia Dortmund"
  },
  2: {
    name: "Bayer 04 Leverkusen"
  },
  3: {
    name: "RB Leipzig"
  },
  4: {
    name: "Eintracht Frankfurt"
  },
  5: {
    name: "Mainz05"
  }
}
const anzahlMannschaften = Object.keys(mannschaften).length
const anzahlSpieleProSpieltag = anzahlMannschaften / 2
const anzahlSpieltage = (anzahlMannschaften - 1) * 2

function createTestspiele() {
  const saisons = {
    2022: {
      saison: "2022/2023",
      spieltage: {}
    }
  }

  const saisonIndex = 2022
  const saison = saisons[saisonIndex]

  let datum = new Date("2022-08-06T13:30:00Z")

  for (let spieltagIndex = 0; spieltagIndex < anzahlSpieltage; spieltagIndex++) {
    const spieltag = {
      spiele: {}
    }
    saison.spieltage[spieltagIndex] = spieltag

    for (let spielIndex = 0; spielIndex < anzahlSpieleProSpieltag; spielIndex++) {
      const indexHeim = Math.floor(Math.random() * anzahlMannschaften)
      let indexGast = Math.floor(Math.random() * anzahlMannschaften)
      while (indexGast === indexHeim) {
        indexGast = Math.floor(Math.random() * anzahlMannschaften)
      }

      spieltag.spiele[spielIndex] = {
        datum: datum,
        heim: indexHeim,
        gast: indexGast,
        toreHeim: Math.floor(Math.random() * 4),
        toreGast: Math.floor(Math.random() * 4)
      }
    }

    datum.setDate(datum.getDate() + 7)
  }

  return saisons
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

const dummyTabelle = {
  spieltag: 3,
  mannschaften: [
    {
      id: 0,
      tore: 97,
      gegentore: 37,
      punkte: 77
    },{
      id: 1,
      tore: 85,
      gegentore: 52,
      punkte: 69
    }
  ]
}

const dummyTabelle2 = {
  spieltag: 3,
  mannschaften: {
    0: {
      id: 0,
      spiele: 34,
      tore: 97,
      gegentore: 37,
      punkte: 77
    },
    1: {
      id: 1,
      spiele: 34,
      tore: 85,
      gegentore: 52,
      punkte: 69
    }
  }
}

const dummyTabelle3 = {
  spieltag: 3,
  mannschaften: [
    {
      id: 0,
      spiele: 34,
      tore: 97,
      gegentore: 37,
      punkte: 77
    },{
      id: 1,
      spiele: 34,
      tore: 85,
      gegentore: 52,
      punkte: 69
    }
  ]
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

function fillTabelle(spieltage, spieltagnummer) {
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
  for (let i = 0; i <= spieltagnummer; i++) {
    addSpieltagToTabelle(tabelle, spieltage[i])
  }

  tabelle.mannschaften.sort(mannschaftComparator)

  const nameElementCells = document.querySelectorAll('.tabelle [data-index="1"] cell')
  for (let i = 0; i < tabelle.mannschaften.length; i++) {
    nameElementCells[i + 1].textContent = mannschaften[tabelle.mannschaften[i].id].name
  }

  const spieleElementCells = document.querySelectorAll('.tabelle [data-index="2"] cell')
  for (let i = 0; i < tabelle.mannschaften.length; i++) {
    spieleElementCells[i + 1].textContent = tabelle.mannschaften[i].spiele
  }

  const toreElementCells = document.querySelectorAll('.tabelle [data-index="3"] cell')
  for (let i = 0; i < tabelle.mannschaften.length; i++) {
    toreElementCells[i + 1].textContent = tabelle.mannschaften[i].tore + ":" + tabelle.mannschaften[i].gegentore
  }

  const punkteElementCells = document.querySelectorAll('.tabelle [data-index="4"] cell')
  for (let i = 0; i < tabelle.mannschaften.length; i++) {
    punkteElementCells[i + 1].textContent = tabelle.mannschaften[i].punkte
  }
}

function fillSpieltag(spieltage, spieltagnummer) {
  document.querySelector('.spieltag p2 span').textContent = spieltagnummer + 1 // in code we start with 0, but on the display the first day is "1"

  let cellElements = document.querySelectorAll('.spieltag [data-index="0"] cell')
  for (let i = 0; i < Object.keys(spieltage[spieltagnummer].spiele).length; i++) {
    cellElements[i + 1].textContent = spieltage[spieltagnummer].spiele[i].datum.toLocaleDateString('DE-de', { day: '2-digit', month: '2-digit', year: 'numeric'})
  }

  cellElements = document.querySelectorAll('.spieltag [data-index="1"] cell')
  for (let i = 0; i < Object.keys(spieltage[spieltagnummer].spiele).length; i++) {
    cellElements[i + 1].textContent = mannschaften[spieltage[spieltagnummer].spiele[i].heim].name
  }

  // Ergebnis
  cellElements = document.querySelectorAll('.spieltag [data-index="2"] cell')
  for (let i = 0; i < Object.keys(spieltage[spieltagnummer].spiele).length; i++) {
    cellElements[i + 1].textContent = spieltage[spieltagnummer].spiele[i].toreHeim + ":" + spieltage[spieltagnummer].spiele[i].toreGast
  }

  cellElements = document.querySelectorAll('.spieltag [data-index="3"] cell')
  for (let i = 0; i < Object.keys(spieltage[spieltagnummer].spiele).length; i++) {
    cellElements[i + 1].textContent = mannschaften[spieltage[spieltagnummer].spiele[i].gast].name
  }
}

const saisons = createTestspiele()
//console.log(saisons)

fillTabelle(saisons[2022].spieltage, 2)
fillSpieltag(saisons[2022].spieltage, 2)