import "./Header.scss";
import { Box, Button, Icon, IconButton, Typography } from "@material-ui/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import IconText, { Variant } from "../IconText";
import React from "react";

interface HeaderProps {
  icon?: IconProp;
  title: string;
  titleVariant: Variant;
  textColor?: string;
  iconColor?: string;
  showSecondaryIcon?: boolean;
  secondaryIcon?: JSX.Element; // need to type after consolidating icon set to use
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
          classes={{ root: "IconButton-root" }}
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
