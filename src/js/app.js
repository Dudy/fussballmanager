import { init } from './init.js'

const data = {
  mannschaften: null,
  anzahlMannschaften: 0,
  anzahlSpieltage: 0,
  aktuelleSaison: 2022,
  aktuellerSpieltag: -1,
  saisons: null
}

await init(data)
