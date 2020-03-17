import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import clsx from "clsx";

interface ProgressButtonProps {
  action: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center"
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative"
    },
    buttonSuccess: {
      backgroundColor: "primary",
      "&:hover": {
        backgroundColor: "primary"
      }
    },
    buttonProgress: {
      color: "primary",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  })
);

const ProgressButton = (props: ProgressButtonProps) => {
  const { action } = props;
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const isAsync = async () => {
    console.log("setting loading should print false", loading);
    setLoading(loading === true ? false : true);
    console.log("loading set should pirnt true ", loading);
    await action();
    setLoading(loading === true ? false : true);
    console.log("settion loading back to false should print false", loading);
  };

  React.useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={isAsync}
        >
          Delete User
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
};
export default ProgressButton;
