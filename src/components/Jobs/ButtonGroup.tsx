import { Box, WithStyles, createStyles, withStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { galileoDarkBlue } from "../theme";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
const useStyles = makeStyles(theme => ({
  toggleContainer: {
    margin: theme.spacing(2, 0)
  }
}));

interface ButtonGroupProps extends WithStyles<typeof styles> {
  toggleMode?: any;
  mode: string;
  changeSelectedButton: any;
  buttons?: Array<string>;
}
const styles = () =>
  createStyles({
    root: {
      minWidth: 175,
      width: "100%",
      borderRadius: 0
    },
    selected: {
      backgroundColor: galileoDarkBlue.main,
      color: "white"
    }
  });
const ButtonGroup: React.SFC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const [activeButton, setActiveButton] = React.useState<string | null>(
    props.buttons[0]
  );

  const handleActiveButton = (
    event: React.MouseEvent<HTMLElement>,
    newActiveButton: string | null
  ) => {
    setActiveButton(newActiveButton);
    changeSelectedButton(newActiveButton);
    props.toggleMode();
  };
  const { classes, mode, changeSelectedButton, buttons } = props;
  const toggleClasses = useStyles();
  return (
    <div className={toggleClasses.toggleContainer}>
      <ToggleButtonGroup
        size="small"
        value={activeButton}
        onChange={handleActiveButton}
      >
        <Box display="flex">
          {buttons.map((button, index) => {
            return (
              <Box key={button}>
                <ToggleButton
                  key={index}
                  classes={{ root: classes.root, selected: classes.selected }}
                  value={button}
                  selected={button === activeButton}
                  onClick={event => handleActiveButton(event, button)}
                >
                  {button}
                </ToggleButton>
              </Box>
            );
          })}
        </Box>
      </ToggleButtonGroup>
    </div>
  );
};

export default withStyles(styles)(ButtonGroup);
