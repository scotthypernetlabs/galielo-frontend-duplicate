import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Variant as ThemeVariant } from "@material-ui/core/styles/createTypography";
import { Typography } from "@material-ui/core";

export type Variant = ThemeVariant | "srOnly";

export interface IconTextProps {
  icon?: IconProp;
  text: string;
  color?: string;
  textVariant: Variant;
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
