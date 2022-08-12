import { show as zeigeIndividualtraining } from './individualtraining.js';
import { show as zeigeMannschaftstraining } from './mannschaftstraining.js';
import { show as zeigeTransfermarkt } from './transfermarkt.js';
import { show as zeigeMitarbeiter } from './mitarbeiter.js';
import { onNavigate } from '../router.js'

const navigation = {
    individualtraining: zeigeIndividualtraining,
    mannschaftstraining: zeigeMannschaftstraining,
    transfermarkt: zeigeTransfermarkt,
    mitarbeiter: zeigeMitarbeiter
}

function subnavigation(event) {
    // Navigation managen
    document.querySelectorAll('.navbar-left li.nav-item').forEach(item => item.classList.remove('active'));
    event.target.parentElement.classList.add('active');

    // Inhalt umschalten
    const sektion = event.target.href.split('#')[1];
    navigation[sektion]();
}







export function init(activeElement) {

    const subnavigationElement = document.querySelector('#subnavigationTemplate').content.cloneNode(true);

    const navListItems = [
        erzeugeNavItem('#individualtraining', 'Individualtraining', activeElement === 'individualtraining'),
        erzeugeNavItem('#mannschaftstraining', 'Mannschaftstraining', activeElement === 'mannschaftstraining'),
        erzeugeNavItem('#transfermarkt', 'Transfermarkt', activeElement === 'transfermarkt'),
        erzeugeNavItem('#mitarbeiter', 'Mitarbeiter', activeElement === 'mitarbeiter')
    ];

    const navListe = subnavigationElement.querySelector('nav.navbar-left ul.nav-links');
    navListe.replaceChildren(...navListItems);

    document.querySelector('#subnavigation').replaceChildren(subnavigationElement);
}

function erzeugeNavItem(href, text, active = false) {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.appendChild(document.createTextNode(text));
    anchor.addEventListener('click', subnavigation);
    
    const listItem = document.createElement('li');
    listItem.classList.add('nav-item');
    if (active) {
        listItem.classList.add('active');
    }
    listItem.appendChild(anchor);

    return listItem;
}

/*
        <template id="subnavigationTemplate">
            <nav class="navbar-left" aria-label="subnavigation">
                <ul class="nav-links">
                    <li class="nav-item active"><a href="#" data-id="uebersicht">Übersicht</a></li>
                    <li class="nav-item"><a href="#" data-id="aufstellung">Aufstellung</a></li>
                    <li class="nav-item"><a href="#" data-id="letztesSpiel">letztes Spiel</a></li>
                    <li class="nav-item"><a href="#" data-id="menu4">Menu 4</a></li>
                </ul>
            </nav>
        </template>
*/