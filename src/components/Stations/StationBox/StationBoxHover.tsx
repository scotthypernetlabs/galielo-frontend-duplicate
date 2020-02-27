import { Button, Grid } from "@material-ui/core";
import React from "react";

interface StationBoxHoverProps {
  hover: boolean;
  handleOpenStation: any;
  handleRunJobClick: any;
}

const StationBoxHover: React.SFC<StationBoxHoverProps> = (
  props: StationBoxHoverProps
) => {
  const { hover, handleOpenStation, handleRunJobClick } = props;
  let className = "station-hover-grid";
  if (!hover) {
    className += " hidden";
  }
  return (
    <Grid container className={className}>
      <Grid className="station-hover-button-container">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleOpenStation}
        >
          View Station
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleRunJobClick}
        >
          Run Job
        </Button>
      </Grid>
    </Grid>
  );
};

export default StationBoxHover;
