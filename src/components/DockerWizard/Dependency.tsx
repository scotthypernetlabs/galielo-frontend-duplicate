import React, { useState } from "react"; // we need this to make JSX compile
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Box, Paper, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
// import { TextField } from 'formik-material-ui';

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

interface DependencyProps {
  index: number;
  item: any;
  onDelete: any;
  updateDependency: any;
}

const Dependency: React.SFC<DependencyProps> = (props: DependencyProps) => {
  const { item, onDelete, updateDependency, index } = props;
  const [openVersionDialog, setOpenVersionDialog] = useState(
    false
  );
  const [version, setVersion] = useState("");
  console.log("item in dependency", item);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const handleClickOpen = () => {
    setOpenVersionDialog(true);
  };

  const handleClose = () => {
    setOpenVersionDialog(false);
  };
  const saveAndClose =()=> {
    updateDependency(index, version);
    handleClose();
  }
  const updateVesion = () => {
    item.version = "v.1.2";
  };
  return (
    <>
      <Box display="flex" className="dependency">
        <Box flexGrow={1}>
          <Typography className={classes.title} variant="body2" component="p">
            {item.name} <span>Version: {item.version}</span>
          </Typography>
          <Link
            onClick={() => handleClickOpen()}
            variant="caption"
          >
            Change Version
          </Link>
        </Box>
        <Box>
          <IconButton
            edge="end"
            size="small"
            onClick={onDelete}
            aria-label="delete dependency"
            component="span"
          >
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={openVersionDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <TextField
              onChange={(event: any) => setVersion(event.target.value)}
              id="dependency-version-input"
              label="Enter version number Eg. 1.0.7"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
          disabled = {version === ""}
          onClick={saveAndClose} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Discard          
            </Button>
        </DialogActions>
      </Dialog>

      {/* {showDependencyVersionInput && (
        <>
          <Box display="flex">
            <TextField
              onChange={(event: any) => setVersion(event.target.value)}
              id="dependency-version-input"
              label="Enter version number Eg. 1.0.7"
            />
            <Box ml={1}>
              <Link
                color="primary"
                onClick={() => {
                  updateDependency(index, version);
                  setShowDependencyVersionInput(false);
                }}
                variant="caption"
              >
                Save
              </Link>
              <Link
                onClick={() => setShowDependencyVersionInput(false)}
                variant="caption"
              >
                Discard
              </Link>
            </Box>
          </Box>
        </>
      )} */}
    </>
  );
};
export default Dependency;
