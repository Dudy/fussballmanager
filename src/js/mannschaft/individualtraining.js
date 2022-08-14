export function show() {
    const individualtrainingElement = document.querySelector('#mannschaftIndividualtrainingTemplate').content.cloneNode(true);
    document.querySelector('#inhalt').replaceChildren(individualtrainingElement);

    addEventHandler();
}

function addEventHandler() {
    //document.querySelector('#foo').addEventListener('click', bar);
}

function bar() {
    // todo
}
