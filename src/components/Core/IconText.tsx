import * as React from "react";
import { Icon, Typography } from "@material-ui/core";

export interface IconTextProps {
  icon?: string;
  text: string;
  textColor?: string;
  iconColor?: string;
  textVariant: any;
  noWrap?: boolean;
  iconSize?: number;
}

const IconText: React.SFC<IconTextProps> = (props: IconTextProps) => {
  const {
    icon,
    text,
    textColor,
    iconColor,
    textVariant,
    noWrap,
    iconSize
  } = props;
  return (
    <>
      <Icon
        style={{
          marginRight: 10,
          color: iconColor,
          float: "left",
          alignSelf: "center",
          fontSize: iconSize
        }}
      >
        {icon}
      </Icon>
      <Typography
        variant={textVariant}
        style={{
          color: textColor,
          float: "left",
          alignSelf: "center"
        }}
        noWrap={noWrap}
      >
        {text}
      </Typography>
    </>
  );
};

export default IconText;
