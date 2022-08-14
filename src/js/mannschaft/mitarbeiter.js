export function show() {
    const mitarbeiterElement = document.querySelector('#mannschaftMitarbeiterTemplate').content.cloneNode(true);
    document.querySelector('#inhalt').replaceChildren(mitarbeiterElement);
    
    addEventHandler();
}

function addEventHandler() {
    //document.querySelector('#foo').addEventListener('click', bar);
}

function bar() {
    // todo
}
