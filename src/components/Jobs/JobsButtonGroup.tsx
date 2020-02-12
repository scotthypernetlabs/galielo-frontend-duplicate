import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import React from "react";
import {createStyles, WithStyles, withStyles} from "@material-ui/core";
import {galileoDarkBlue} from "../theme";

interface Props extends WithStyles<typeof styles>{
  toggleMode: any;
  mode: boolean;
}

type State = {}

const styles = () => createStyles({
  root: {
    minWidth: 175,
    width: "100%"
  },
  selected: {
    backgroundColor: galileoDarkBlue.main,
    color: "white",
    // "&:hover": {
    //   backgroundColor: galileoDarkBlue.main
    // }
  }
});

class JobsButtonGroup extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
  }

  render() {
    const {classes} = this.props;
    return(
      <ToggleButtonGroup
      >
        <ToggleButton
          classes={{root: classes.root, selected: classes.selected}}
          value="Sent"
          selected={this.props.mode}
          onClick={this.props.toggleMode}
        >
          Sent
        </ToggleButton>
        <ToggleButton
          classes={{root: classes.root}}
          value="Received"
          selected={!this.props.mode}
          onClick={this.props.toggleMode}
        >
          Received
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }
}

export default withStyles(styles)(JobsButtonGroup)
