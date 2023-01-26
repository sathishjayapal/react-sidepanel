// import React from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
// import { WindowRestoreIcon } from '@fluentui/react-northstar';


// export default function Configure() {
//     msTeams.settings.registerOnSaveHandler(saveEvent => {
//         msTeams.settings.setSettings({
//             contentUrl: window.location.origin,
//             entityId: window.location.origin
//         });

//         saveEvent.notifySuccess();
//     });
//     msTeams.settings.setValidityState(true);
//     return(
//         <h1>Configure</h1>
//     )
// }

import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import {ensureTeamsSdkInitialized} from './teamsHelpers.js';

async function displayUI() {

    try {
        await ensureTeamsSdkInitialized();

        // Set up the save handler for when they save the config
        microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
            saveEvent.notifySuccess();
        });
        microsoftTeams.settings.setValidityState(true);
    } catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error.message)}`;
    }
}

displayUI();
