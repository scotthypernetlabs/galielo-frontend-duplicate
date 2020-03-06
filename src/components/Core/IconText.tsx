import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@material-ui/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface IconTextProps {
  icon?: IconProp;
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
      <FontAwesomeIcon
        icon={icon}
        style={{
          marginRight: 10,
          color: iconColor,
          float: "left",
          alignSelf: "center"
        }}
        size={iconSize}
      />
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
