import {createMuiTheme} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

export const galileoTeal = {
  main: '#4dc1ab',
  light: '#83f4dd',
  dark: '#00907c'
};


export const galileoDarkBlue = {
  main: '#354962',
  light: '#4a5a73',
  dark: '#092238'
};

const MuiDrawer = {
  root: {
    minWidth: 250
  },
  paper: {
    background: galileoDarkBlue.main,
    minWidth: 250,
    maxWidth: 250,
    fontSize: 16,
    // all typography is white
    '& *': {
      color: "white",
      cursor: "pointer"
    },
  }
};

const MuiListItem = {
  root: {
    paddingBottom: 15,
    paddingTop: 15,
    borderBottom: `1px solid ${galileoDarkBlue.light}`,
    "&$selected": {
      backgroundColor: galileoTeal.main,
      "&:hover": {
        backgroundColor: galileoTeal.main
      }
    }
  },
  button: {
    "&:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  },
  gutters: {
    paddingRight: 20,
    paddingLeft: 20
  }
};

const MuiListItemText = {
  root: {
    margin: 10
  }
};

const MuiButtonBase = {
  disableRipple: true
};

const MuiButtonCss = {
  root: {
    textTransform: "none",
    fontWeight: 400,
    '& *': {
      cursor: "pointer"
    },
    margin: 5
  }
};

const MuiToggleButtonProps = {
  disableRipple: true,
  disableFocusRipple: true,
  color: galileoTeal.main
};

const MuiToggleButtonCss = {
  root: {
    borderColor: galileoDarkBlue.main,
    color: galileoDarkBlue.main,
    textTransform: "none",
    "&$selected": {
      backgroundColor: galileoDarkBlue.main,
      color: "white",
      "&:hover": {
        backgroundColor: galileoDarkBlue.main
      }
    },
    '& *': {
      cursor: "pointer"
    },
  }
};

const MuiDivider = {
  root: {
    marginBottom: 10,
    backgroundColor: "black"
  }
};

const MuiGrid = {
  root: {
    marginBottom: 10
  }
};

const MuiTableRow = {
  root: {
    backgroundColor: "white"
  }
};

const MuiTableCell = {
  root: {
    fontWeight: 400,
    fontSize: '0.9em'
  },
  head: {
    color: 'gray',
    fontWeight: 200,
  }
};

const MuiTableHead = {
  root: {
    '& *': {
      textTransform: 'uppercase'
    },
    color: 'light-gray',
    fontSize: '0.9em',
    fontWeight: 100
  }
};

const MuiSwitch = {
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: 5,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
    color: 'white'
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${grey[400]}`,
    backgroundColor: grey[400],
    opacity: 1,
  },
  checked: {},
};

const MuiTextField = {
  root: {
    marginTop: 5,
    marginBottom: 5,
    width: "100%"
  }
};

const MuiBadge = {
  root: {
    height: 15,
    width: 15
  }
};

const typography = {
    h1: {
      fontSize: '2em',
      gutterBottom: 10
    },
    h2: {
      fontSize: '1.5em',
      gutterBottom: 10
    },
    h3: {
      fontSize: '1.17em',
      gutterBottom: 10
    },
    h4: {
      fontSize: '1.12em',
      gutterBottom: 10
    },
    h5: {
      fontSize: '0.83em',
      gutterBottom: 10
    },
    h6: {
      fontSize: '.75em',
      gutterBottom: 10
    }
};

export const Theme = createMuiTheme({
  palette: {
    primary: {
      main: galileoTeal.main,
      light: galileoTeal.light,
      dark: galileoTeal.dark,
      contrastText: "white"
    },
    secondary: {
      main: galileoDarkBlue.main,
      light: galileoDarkBlue.light,
      dark: galileoDarkBlue.dark,
      contrastText: "white"
    }
  },
  overrides: {
    MuiDrawer,
    MuiListItem,
    MuiListItemText,
    MuiDivider,
    MuiGrid,
    MuiTableRow,
    MuiTableHead,
    MuiTableCell,
    MuiSwitch,
    MuiTextField,
    MuiBadge,
    // @ts-ignore
    MuiButton: MuiButtonCss,
    MuiToggleButton: MuiToggleButtonCss,
  },
  props: {
    MuiButtonBase,
    // MuiButton: MuiButtonProps,
    // @ts-ignore
    MuiToggleButton: MuiToggleButtonProps
  },
  typography,
  // @ts-ignore
  shadows: Array(25).fill('none')
});
