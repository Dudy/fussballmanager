const sleep = ms => new Promise(r => setTimeout(r, ms))

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

const spielplan = {

}

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

function createCell(text) {
  const cellNode = document.createElement("cell")
  //cellNode.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const textNode = document.createTextNode(text)
  cellNode.appendChild(textNode)
  return cellNode
}

function fillTabelle2() {
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

/*
  const nameDaten2 = Array()
  for (const mannschaft of tabelle.mannschaften) {
    nameDaten2.push(mannschaften[mannschaft.id].name)
  }
  */



  let platzDaten = [...Array(18).keys()].map(i => createCell((i + 1) + '.'))
  let nameDaten
  let spieleDaten
  let toreDaten
  let punkteDaten

  if (aktuellerSpieltag === -1) {
    nameDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array(tabelle.mannschaften.length).fill(createCell("0"))
    toreDaten = Array(tabelle.mannschaften.length).fill(createCell("0:0"))
    punkteDaten = Array(tabelle.mannschaften.length).fill(createCell("0"))
  } else {
    for (let i = 0; i <= aktuellerSpieltag; i++) {
      addSpieltagToTabelle(tabelle, spieltage[i])
    }

    tabelle.mannschaften.sort(mannschaftComparator)

    nameDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.spiele))
    toreDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.tore + ":" + mannschaft.gegentore))
    punkteDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.punkte))
  }





  platzDaten.unshift(createCell("Platz"))
  nameDaten.unshift(createCell("Name"))
  spieleDaten.unshift(createCell("Spiele"))
  toreDaten.unshift(createCell("Tore"))
  punkteDaten.unshift(createCell("Punkte"))

  const platzColumnElement = document.querySelector('.tabelle [data-type="platz"]')
  platzColumnElement.replaceChildren(...platzDaten)
  
  const nameColumnElement = document.querySelector('.tabelle [data-type="name"]')
  nameColumnElement.replaceChildren(...nameDaten)

  const spieleColumnElement = document.querySelector('.tabelle [data-type="spiele"]')
  console.log(spieleColumnElement)
  console.log(spieleDaten)
  console.log(...spieleDaten)

  
  spieleColumnElement.replaceChildren(...spieleDaten)
  console.log(spieleColumnElement)

  const toreColumnElement = document.querySelector('.tabelle [data-type="tore"]')
  toreColumnElement.replaceChildren(...toreDaten)

  const punkteColumnElement = document.querySelector('.tabelle [data-type="punkte"]')
  punkteColumnElement.replaceChildren(...punkteDaten)



  
}

async function fillTabelle() {
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







  let platzDaten = [...Array(18).keys()].map(i => createCell((i + 1) + '.'))
  let nameDaten
  let spieleDaten
  let toreDaten
  let punkteDaten

  

  if (aktuellerSpieltag === -1) {
    nameDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array.from({length: tabelle.mannschaften.length}, () => createCell('0'))
    toreDaten = Array.from({length: tabelle.mannschaften.length}, () => createCell('0:0'))
    punkteDaten = Array.from({length: tabelle.mannschaften.length}, () => createCell('0'))
  } else {
    for (let i = 0; i <= aktuellerSpieltag; i++) {
      addSpieltagToTabelle(tabelle, spieltage[i])
    }

    tabelle.mannschaften.sort(mannschaftComparator)

    nameDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaften[mannschaft.id].name))
    spieleDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.spiele))
    toreDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.tore + ":" + mannschaft.gegentore))
    punkteDaten = Array.from(tabelle.mannschaften, mannschaft => createCell(mannschaft.punkte))
  }

  platzDaten.unshift(createCell("Platz"))
  nameDaten.unshift(createCell("Name"))
  spieleDaten.unshift(createCell("Spiele"))
  toreDaten.unshift(createCell("Tore"))
  punkteDaten.unshift(createCell("Punkte"))

  const platzColumnElement = document.querySelector('.tabelle [data-type="platz"]')
  platzColumnElement.replaceChildren(...platzDaten)
  
  const nameColumnElement = document.querySelector('.tabelle [data-type="name"]')
  nameColumnElement.replaceChildren(...nameDaten)

  const spieleColumnElement = document.querySelector('.tabelle [data-type="spiele"]')
  spieleColumnElement.replaceChildren(...spieleDaten)

  const toreColumnElement = document.querySelector('.tabelle [data-type="tore"]')
  toreColumnElement.replaceChildren(...toreDaten)

  const punkteColumnElement = document.querySelector('.tabelle [data-type="punkte"]')
  punkteColumnElement.replaceChildren(...punkteDaten)
}

function fillSpieltag() {
  const spieltage = saisons[aktuelleSaison].spieltage

  document.querySelector('.spieltag p2 span').textContent = aktuellerSpieltag + 1 // in code we start with 0, but on the display the first day is "1"

  if (aktuellerSpieltag === -1) {
    let cellElements = document.querySelectorAll('.spieltag [data-index="0"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag + 1].spiele).length; i++) {
      cellElements[i + 1].textContent = spieltage[aktuellerSpieltag + 1].spiele[i].datum.toLocaleDateString('DE-de', { day: '2-digit', month: '2-digit', year: 'numeric'})
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="1"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag + 1].spiele).length; i++) {
      cellElements[i + 1].textContent = mannschaften[spieltage[aktuellerSpieltag + 1].spiele[i].heim].name
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="2"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag + 1].spiele).length; i++) {
      cellElements[i + 1].textContent = "tbd"
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="3"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag + 1].spiele).length; i++) {
      cellElements[i + 1].textContent = mannschaften[spieltage[aktuellerSpieltag + 1].spiele[i].gast].name
    }
  } else {
    let cellElements = document.querySelectorAll('.spieltag [data-index="0"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag].spiele).length; i++) {
      cellElements[i + 1].textContent = spieltage[aktuellerSpieltag].spiele[i].datum.toLocaleDateString('DE-de', { day: '2-digit', month: '2-digit', year: 'numeric'})
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="1"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag].spiele).length; i++) {
      cellElements[i + 1].textContent = mannschaften[spieltage[aktuellerSpieltag].spiele[i].heim].name
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="2"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag].spiele).length; i++) {
      cellElements[i + 1].textContent = spieltage[aktuellerSpieltag].spiele[i].toreHeim + ":" + spieltage[aktuellerSpieltag].spiele[i].toreGast
    }

    cellElements = document.querySelectorAll('.spieltag [data-index="3"] cell')
    for (let i = 0; i < Object.keys(spieltage[aktuellerSpieltag].spiele).length; i++) {
      cellElements[i + 1].textContent = mannschaften[spieltage[aktuellerSpieltag].spiele[i].gast].name
    }
  }
}

// -------------------------
function vorigerSpieltag() {
  if (aktuellerSpieltag > -1) {
    aktuellerSpieltag -= 1
    fillTabelle()
    //fillSpieltag()
  }
}

function naechsterSpieltag() {
  if (aktuellerSpieltag < anzahlSpieltage - 1) {
    aktuellerSpieltag += 1
    fillTabelle()
    //fillSpieltag()
  }
}

function addEventHandler() {
  document.getElementById('voriger-spieltag').addEventListener('click', vorigerSpieltag)
  document.getElementById('naechster-spieltag').addEventListener('click', naechsterSpieltag)
}











console.log("Test")

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


function erzeugeSpieltagspaarungen(spieltag) {
  const alleMannschaften = [...Array(18).keys()]
  alleMannschaften.shift()
  let mannschaft1
  let mannschaft2
  const grenze = Math.ceil(spieltag / 2)
  const spiele = []

  while (alleMannschaften.length > 1) {
    mannschaft1 = alleMannschaften.shift()
    mannschaft2 = spieltag - mannschaft1
    if (mannschaft1 === mannschaft2) {
      alleMannschaften.push(mannschaft1)
      continue
    }
    if (mannschaft1 >= grenze) {
      mannschaft2 += 17
    }
    alleMannschaften.splice(alleMannschaften.indexOf(mannschaft2), 1)
    spiele.push({
      heim: ((mannschaft1 + mannschaft2) % 2 === 0) ? Math.max(mannschaft1, mannschaft2) : Math.min(mannschaft1, mannschaft2),
      gast: ((mannschaft1 + mannschaft2) % 2 === 0) ? Math.min(mannschaft1, mannschaft2) : Math.max(mannschaft1, mannschaft2)
    })
  }
  spiele.push({
    heim: (alleMannschaften[0] >= 8 && alleMannschaften[0] <= 16) ? 17 : alleMannschaften[0],
    gast: (alleMannschaften[0] >= 8 && alleMannschaften[0] <= 16) ? alleMannschaften[0] : 17
  })
}



//erzeugeSpieltagspaarungen(10)

//console.log('Anzahl Spiele: %s', anzahlSpieltage)

addEventHandler()

const saisons = createTestspiele()
await fillTabelle()
//fillSpieltag()


    
