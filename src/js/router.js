import { show as showUebersicht } from './spieltag/uebersicht.js';
import { show as showIndividualtraining } from './mannschaft/individualtraining.js';

const routes = {
    // '/' : home,
    '/spieltag' : showUebersicht,
    '/mannschaft' : showIndividualtraining
};

export const onNavigate = (pathname) => {
    window.history.pushState(
        {},
        pathname,
        window.location.origin + pathname
    );
}

window.onpopstate = () => {
    //rootDiv.innerHTML = routes[window.location.pathname]
    console.log(routes[window.location.pathname]);
    //routes[window.location.pathname]();
}
