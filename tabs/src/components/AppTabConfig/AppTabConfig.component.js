import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const AppTabConfig = () => {
  useEffect(() => {
    console.log("msteams enter use effect ");
    microsoftTeams.app.initialize().then(() => {
      console.log("msteams initialized client SDK");
      microsoftTeams.pages.config.registerOnSaveHandler(function (saveEvent) {
        console.log("msteams save handler ");
        microsoftTeams.pages.config.setConfig({
          suggestedDisplayName: "Cboard AAC",
          contentUrl: `${window.location.origin}/sidepanel`,
        });
        saveEvent.notifySuccess();
      });

      microsoftTeams.pages.config.setValidityState(true);
    });
  });

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'baseline',
          mb: 2
        }}
      >
        <Typography
          variant="h3"
          color="text.primary"      >
          Welcome to Cboard AAC!
        </Typography>
        <Typography
          variant="h5"
          color="text.primary">
          Press the save button to continue.
        </Typography>
      </Box>
    </div>
  );
}

export default AppTabConfig;