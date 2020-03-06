import "./Header.scss";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import IconText, { Variant } from "../IconText";
import React from "react";
import { linkBlue } from "../../theme";

interface HeaderProps {
  icon?: IconProp;
  title: string;
  titleVariant: Variant;
  textColor?: string;
  iconColor?: string;
  showSecondaryIcon?: boolean;
  secondaryIcon?: JSX.Element;
  onClickSecondaryIcon?: any;
  showButton?: boolean;
  onClickButton?: any;
  buttonText?: string;
}

const Header: React.SFC<HeaderProps> = (props: HeaderProps) => {
  const {
    icon,
    title,
    titleVariant,
    textColor,
    iconColor,
    showSecondaryIcon,
    secondaryIcon,
    onClickSecondaryIcon,
    showButton,
    onClickButton,
    buttonText
  } = props;
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      className="add-cursor"
    >
      <Box flexGrow={1}>
        {icon ? (
          <IconText
            icon={icon}
            text={title}
            textVariant={titleVariant}
            textColor={textColor}
            iconColor={iconColor}
          />
        ) : (
          <Typography
            variant={titleVariant}
            style={{
              color: textColor,
              float: "left",
              alignSelf: "center"
            }}
          >
            {title}
          </Typography>
        )}
      </Box>
      {showSecondaryIcon && (
        <IconButton
          style={{ color: linkBlue.main, padding: 0, fontSize: 0 }}
          onClick={onClickSecondaryIcon}
        >
          {secondaryIcon}
        </IconButton>
      )}
      {showButton && (
        <Button variant="contained" color="primary" onClick={onClickButton}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default Header;
