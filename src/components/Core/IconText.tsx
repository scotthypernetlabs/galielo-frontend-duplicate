import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@material-ui/core";

interface IconTextProps {
  icon: any;
  text: string;
  color?: string;
  textVariant: any;
}

const IconText: React.SFC<IconTextProps> = (props: IconTextProps) => {
  const { icon, text, color, textVariant } = props;
  return (
    <div>
      <FontAwesomeIcon
        icon={icon}
        style={{
          marginLeft: 5,
          marginRight: 10,
          color: color,
          float: "left",
          verticalAlign: "baseline"
        }}
      />
      <Typography
        variant={textVariant}
        style={{
          color: color,
          float: "left"
        }}
      >
        {text}
      </Typography>
    </div>
  );
};

export default IconText;
