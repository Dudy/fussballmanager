import { data } from '../data.js';
import { init as initSubnavigation } from './subnavigation.js';

export function show() {
    const individualtrainingElement = document.querySelector('#mannschaftIndividualtrainingTemplate').content.cloneNode(true);
    document.querySelector('#inhalt').replaceChildren(individualtrainingElement);

    addEventHandler();
    initSubnavigation('individualtraining');
}

function addEventHandler() {
    //document.querySelector('#foo').addEventListener('click', bar);
}

function bar() {
    // todo
}
