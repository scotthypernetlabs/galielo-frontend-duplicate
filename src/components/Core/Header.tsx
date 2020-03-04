import { Box, Button, Typography } from "@material-ui/core";
import IconText from "./IconText";
import React from "react";

interface HeaderProps {
  icon?: any;
  title: string;
  titleVariant: any;
  textColor?: string;
  iconColor?: string;
  showSecondaryIcon?: boolean;
  secondaryIcon?: any;
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
        <Box className="plus-container" onClick={onClickSecondaryIcon}>
          <i className={secondaryIcon} />
        </Box>
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
