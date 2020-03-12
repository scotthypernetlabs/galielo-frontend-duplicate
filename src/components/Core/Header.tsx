import { Box, Button, Icon, Typography } from "@material-ui/core";
import EditTextForm from "./EditTextForm";
import IconText from "./IconText";
import React from "react";

import ControlPointIcon from "@material-ui/icons/ControlPoint";
import {linkBlue} from "../theme";
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
  editTitle?: boolean;
  handleEditTitle?: Function;
  submitEditTitle?: Function;
  toggleEditTitle?: Function;
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
    buttonText,
    editTitle,
    handleEditTitle,
    submitEditTitle,
    toggleEditTitle
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
            iconSize={20}
          />
        ) : (
          <Typography
            variant={titleVariant}
            style={{
              color: textColor,
              float: "left",
              alignSelf: "center"
            }}
            onClick={() => toggleEditTitle()}
          >
            {editTitle ? (
              <EditTextForm
                name={title}
                handleChange={handleEditTitle}
                handleEditName={submitEditTitle}
              />
            ) : (
              title
            )}
          </Typography>
        )}
      </Box>
      {showSecondaryIcon && (
        <Box className="plus-container" onClick={onClickSecondaryIcon}>
          <Icon color="primary" style={{ fontSize: 24, color: linkBlue.main }}>
            {secondaryIcon}
          </Icon>
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
