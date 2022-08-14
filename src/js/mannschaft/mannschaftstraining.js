export function show() {
    const mannschaftstrainingElement = document.querySelector('#mannschaftMannschaftstrainingTemplate').content.cloneNode(true);
    document.querySelector('#inhalt').replaceChildren(mannschaftstrainingElement);
    
    addEventHandler();
}

function addEventHandler() {
    //document.querySelector('#foo').addEventListener('click', bar);
}

function bar() {
    // todo
}
