import { Box, Button, Grid } from "@material-ui/core";
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
  const {
    hover,
    onClickButton1,
    onClickButton2,
    textButton1,
    textButton2
  } = props;
  return (
    <Box
      display={hover ? "flex" : "none"}
      flexDirection="row"
      className="station-hover-grid"
    >
      <Box className="station-hover-button-container">
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
      </Box>
    </Box>
  );
};

export default BoxHover;
