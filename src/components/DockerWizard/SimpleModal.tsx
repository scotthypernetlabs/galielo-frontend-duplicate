import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Modal,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import React from "react";
const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
};

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

interface IQueryModalProps {
  buttonMethod?: any;
  header?: string;
  hasBodyText?: boolean;
  titleText?: string;
  hasTitle?: boolean;
  bodyText?: string;
  button1Text?: string;
  button2Text?: string;
  secondButton?: boolean;
}

const SimpleModal: React.SFC<IQueryModalProps> = (props: IQueryModalProps) => {
  const {
    buttonMethod,
    header,
    hasBodyText,
    titleText,
    hasTitle,
    bodyText,
    button1Text,
    button2Text,
    secondButton
  } = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const PaperComponent = (props: PaperProps) => {
    return <Paper {...props} />;
  };

  return (
    <div>
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
      >
        <DialogContent>
          <Typography color="primary" id="simple-modal-description">
            <Box fontSize="h2.fontSize" m={1}>
              {titleText}
            </Box>
          </Typography>
          <Box m={1}>{bodyText}</Box>
          <div className="query-button-container">
            <Box
              display="flex"
              justifyContent="center"
              m={1}
              bgcolor="background.paper"
            >
              {secondButton && (
                <Box>
                  <Button
                    className={["secondary-button-large", "styled-button"].join(
                      " "
                    )}
                    variant="outlined"
                    onClick={props.buttonMethod(false)}
                  >
                    {button1Text}
                  </Button>
                </Box>
              )}
              <Box>
                <Button
                  className={["primary-button-large", "styled-button"].join(
                    " "
                  )}
                  variant="contained"
                  color="primary"
                  onClick={props.buttonMethod(true)}
                >
                  {button2Text}
                </Button>
              </Box>
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SimpleModal;
