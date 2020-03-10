import { Box, Button, Typography, Icon } from "@material-ui/core";
import IconText from "./IconText";
import React from "react";
import EditTextForm from "./EditTextForm";

import ControlPointIcon from '@material-ui/icons/ControlPoint';
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
            {(editTitle ?
              <EditTextForm
                name={title}
                handleChange={handleEditTitle}
                handleEditName={submitEditTitle}
                />
                :
                title)}
          </Typography>
        )}
      </Box>
      {showSecondaryIcon && (
        <Box className="plus-container" onClick={onClickSecondaryIcon}>
          <Icon>{secondaryIcon}</Icon>
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
