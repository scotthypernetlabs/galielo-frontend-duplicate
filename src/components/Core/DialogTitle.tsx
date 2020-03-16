import { Close } from "@material-ui/icons";
import { IconButton, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import React from "react";

interface DialogTitleProps {
  title: string;
  handleClose: any;
}

const DialogTitle: React.SFC<DialogTitleProps> = (props: DialogTitleProps) => {
  const { title, handleClose } = props;
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h3" className="typography">
        {title}
      </Typography>
      <IconButton
        onClick={handleClose}
        style={{ position: "absolute" }}
        className="close-button add-cursor"
      >
        <Close />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default DialogTitle;
