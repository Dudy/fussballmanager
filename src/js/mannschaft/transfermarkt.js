export function show() {
    const transfermarktElement = document.querySelector('#mannschaftTransfermarktTemplate').content.cloneNode(true);
    document.querySelector('#inhalt').replaceChildren(transfermarktElement);
    
    addEventHandler();
}

function addEventHandler() {
    //document.querySelector('#foo').addEventListener('click', bar);
}

function bar() {
    // todo
}
