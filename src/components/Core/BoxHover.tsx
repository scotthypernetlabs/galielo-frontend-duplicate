import { Button, Grid } from "@material-ui/core";
import React from "react";

interface StationBoxHoverProps {
  hover: boolean;
  onClickButton1: any;
  onClickButton2: any;
  textButton1: string;
  textButton2: string;
}

const BoxHover: React.SFC<StationBoxHoverProps> = (
  props: StationBoxHoverProps
) => {
  const { hover, onClickButton1, onClickButton2, textButton1, textButton2 } = props;
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
          onClick={onClickButton1}
        >
          {textButton1}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={onClickButton2}
        >
          {textButton2}
        </Button>
      </Grid>
    </Grid>
  );
};

export default BoxHover;
