import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { WithStyles, createStyles, withStyles } from "@material-ui/core";
import { galileoDarkBlue } from "../theme";
import React from "react";

interface JobsButtonGroupProps extends WithStyles<typeof styles> {
  toggleMode: any;
  mode: boolean;
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
const JobsButtonGroup: React.SFC<JobsButtonGroupProps> = (
  props: JobsButtonGroupProps
) => {
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

export default withStyles(styles)(JobsButtonGroup);
