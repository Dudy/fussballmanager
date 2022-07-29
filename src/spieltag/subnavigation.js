import { show as zeigeUebersicht } from './uebersicht.js'
import { show as zeigeAufstellung } from './aufstellung.js'

export function init(activeElement) {
    const subnavigationElement = document.querySelector('#subnavigationTemplate').content.cloneNode(true)
    for (const item of subnavigationElement.querySelectorAll('li.nav-item')) {
        item.classList.remove('active')
    }
    subnavigationElement.querySelector(`a[data-id="${activeElement}"]`).parentNode.classList.add('active')
    document.querySelector('#subnavigation').replaceChildren(subnavigationElement)
    document.querySelector('a[data-id="uebersicht"]').addEventListener('click', zeigeUebersicht)
    document.querySelector('a[data-id="aufstellung"]').addEventListener('click', zeigeAufstellung)
}
