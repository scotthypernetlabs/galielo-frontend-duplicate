import { Box, Typography } from "@material-ui/core";
import { galileoDarkBlue } from "../theme";
import React, { useState } from "react";

interface FrameworkBoxHoverProps {
  hover: boolean;
  key: string;
  onClick: any;
  handleHover: any;
  text: string;
}

export const FrameworkBoxHover: React.SFC<FrameworkBoxHoverProps> = (
  props: FrameworkBoxHoverProps
) => {
  const { key, onClick, text } = props;
  const [hover, setHover] = useState(false);
  const textColor = hover ? galileoDarkBlue.main : "white";
  return (
    <Box
      bgcolor={hover ? "white" : "rgb(255, 255, 255, 0.2)"}
      minWidth="200px"
      maxWidth="200px"
      minHeight="130px"
      maxHeight="130px"
      key={key}
      onClick={onClick}
      m={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className="add-cursor"
    >
      <Typography variant="h4" style={{ color: textColor }}>
        {text}
      </Typography>
    </Box>
  );
};
