import {
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

type TopText = {
  Titles: string[];
  Processes: Array<string[]>;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 560,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto"
    }
  })
);

interface HecRasFileSelectProps {
  targetFiles: Array<string>;
  updateSelectedProjectsList: any;
  handleFiles: any;
}




const HecRasFileSelect: React.SFC<HecRasFileSelectProps> = (props: HecRasFileSelectProps) => {
  
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const toggleSelection = (value: string) =>{
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.updateSelectedProjectsList(newChecked);
    props.handleFiles(newChecked);
  }
  

  return (
    <>
    {props.targetFiles.length >0 ? 
    <>
    <label>Please select plan files to run</label>
    <List dense className={classes.root}>
     {props.targetFiles.map(value => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem key={value} button
          onClick = {()=>toggleSelection(value)}>
            <ListItemText id={labelId} primary={value} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onClick={()=>toggleSelection(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
    </> :
    <p> We could not find any plan files in the folder</p>
}
    </>
  );
}

export default HecRasFileSelect;