import { fillTabelle, fillSpieltag } from './uiAktualisierungen.js'

export function vorigerSpieltag(data) {
    if (data.aktuellerSpieltag > -1) {
        data.aktuellerSpieltag -= 1
        fillTabelle(data)
        fillSpieltag(data)
    }
}

export function naechsterSpieltag(data) {
    if (data.aktuellerSpieltag < data.anzahlSpieltage - 1) {
        data.aktuellerSpieltag += 1
        fillTabelle(data)
        fillSpieltag(data)
    }
}
