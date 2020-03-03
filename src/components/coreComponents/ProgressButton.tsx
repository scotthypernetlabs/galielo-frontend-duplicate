import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

interface ProgressButtonProps {
  action: any;
  loading: boolean;
  success: boolean;
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: "primary",
      '&:hover': {
        backgroundColor: "primary",
      },
    },
    buttonProgress: {
      color: "primary",
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const ProgressButton = (props: ProgressButtonProps)=> {
  const {
    action,
    loading,
    success
  } = props;
  const classes = useStyles();
  // const [loading, setLoading] = React.useState(false);
  // const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  React.useEffect(() => {
    return () => {
      console.log(loading)
      clearTimeout(timer.current);
    };
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={action}
        >
          Delete User
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}
export default ProgressButton;