import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { WithStyles, createStyles, withStyles } from "@material-ui/core";
import { galileoDarkBlue } from "../theme";
import React from "react";

interface ButtonGroupProps extends WithStyles<typeof styles> {
  toggleMode: any;
  mode: boolean;
  buttons?: Array<string>;
}

const styles = () =>
  createStyles({
    root: {
      minWidth: 175,
      width: "100%"
    },
    selected: {
      backgroundColor: galileoDarkBlue.main,
      color: "white"
    }
  });
const ButtonGroup: React.SFC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const { classes, mode, toggleMode } = props;
  return (
    <ToggleButtonGroup>
      <ToggleButton
        classes={{ root: classes.root, selected: classes.selected }}
        value="Sent"
        selected={mode}
        onClick={toggleMode}
      >
        Sent
      </ToggleButton>
      <ToggleButton
        classes={{ root: classes.root }}
        value="Received"
        selected={!mode}
        onClick={toggleMode}
      >
        Received
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default withStyles(styles)(ButtonGroup);
