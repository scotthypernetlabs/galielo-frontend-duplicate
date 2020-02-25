import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Box, Typography }  from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const getModalStyle = ()=> {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 800,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));


interface IQueryModalProps {
  queryButton?: any
  header?: string
  body?: string
}

const QueryModal: React.SFC<IQueryModalProps> = (props) => {
  const {
    queryButton 
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

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography color="primary" id="simple-modal-description">
            <Box fontSize = "h2.fontSize" m={1}>
              This folder does not contain a Dockerfile. Would you like to use the Docker Wizard?
            </Box>
          </Typography>
            <Box fontSize = "p.fontSize" m={1}>
              You can alsoadd a DockerFile on your own and try again.
            </Box>
        <div className="query-button-container">
          <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
              <Box p={1}>
                <Button className={["secondary-button-large", "styled-button"].join(' ')} variant="outlined"   onClick={ props.queryButton(false) }>
                  Cancel
              </Button>
            </Box>
            <Box p={1}>
              <Button className={["primary-button-large", "styled-button"].join(' ')} variant="contained"  color="primary" onClick={ props.queryButton(true) }>
                Use Docker Wizard
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </Modal>
  </div>
  );
   }
   export default QueryModal;