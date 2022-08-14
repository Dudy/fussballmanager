import { initSubnavigation } from '../utils.js';
import { show as showIndividualtraining } from './individualtraining.js';
import { show as showMannschaftstraining } from './mannschaftstraining.js';
import { show as showTransfermarkt } from './transfermarkt.js';
import { show as showMitarbeiter } from './mitarbeiter.js';

const navigationFunctions = {
    individualtraining: showIndividualtraining,
    mannschaftstraining: showMannschaftstraining,
    transfermarkt: showTransfermarkt,
    mitarbeiter: showMitarbeiter
}

export function show() {
    initSubnavigation(navigationFunctions);
    showIndividualtraining();
}
