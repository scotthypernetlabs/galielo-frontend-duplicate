import {
  Dialog,
  DialogContent,

  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@material-ui/core";
import DialogTitle from "../../Core/DialogTitle";
import React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


type TopText = {
  Titles: string[];
  Processes: Array<string[]>;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 560,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },
  }),
);

interface HecResModalProps {
  text?: TopText;
  isOpen?: boolean;
  handleClose?: any;
  targetFiles: Array<string>;
}

const HecResModal: React.SFC<HecResModalProps> = (
  props: HecResModalProps
) => {
  const { text, isOpen, handleClose } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState([""]);
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };



  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <DialogTitle handleClose={handleClose} title="Manually Select" />
      <DialogContent dividers={true}>
      <List dense className={classes.root}>
      {props.targetFiles.map(value => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem key={value} button>
            <ListItemText id={labelId} primary={value} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
      </DialogContent>
    </Dialog>
  );
};
export default HecResModal;
