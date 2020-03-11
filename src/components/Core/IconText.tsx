import * as React from "react";
import { Typography, Icon } from "@material-ui/core";

export interface IconTextProps {
  icon?: string;
  text: string;
  textColor?: string;
  iconColor?: string;
  textVariant: any;
  noWrap?: boolean;
  iconSize?: any;
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
      alignSelf: "center"
    }}
  >{icon}</Icon>
      
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
