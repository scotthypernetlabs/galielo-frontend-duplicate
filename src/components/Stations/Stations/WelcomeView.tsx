import React from "react";
import {Button, Grid, Typography} from "@material-ui/core";

interface WelcomeViewProps {
  openCreateStation: any;
}

const WelcomeView: React.SFC<WelcomeViewProps> = (
  props: WelcomeViewProps
) => {
  const { openCreateStation } = props;
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      spacing={2}
      style={{ minHeight: 400 }}
    >
      <Grid item>
        <Typography variant="h1" style={{ fontWeight: 700 }}>
          Welcome to Galileo!
        </Typography>
      </Grid>
      <Grid item>
        <Typography>Make a station to get started!</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={openCreateStation}
        >
          Add Station
        </Button>
      </Grid>
    </Grid>
  )
};

export default WelcomeView;
