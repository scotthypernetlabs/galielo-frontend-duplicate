import {createMuiTheme} from "@material-ui/core";

const galileoTeal = {
  main: '#4dc1ab',
  light: '#83f4dd',
  dark: '#00907c'
};


const galileoDarkBlue = {
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
      color: "white"
    },
  }
};

const MuiListItem = {
  root: {
    paddingBottom: 15,
    paddingTop: 15,
    borderBottom: `1px solid ${galileoDarkBlue.light}`,
    "&$selected": {
      "backgroundColor": galileoTeal.main,
      "&:hover": {
        backgroundColor: galileoTeal.main
      }
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

export const Theme = createMuiTheme({
  palette: {
    primary: {
      main: galileoTeal.main,
      light: galileoTeal.light,
      dark: galileoTeal.dark
    },
    secondary: {
      main: galileoDarkBlue.main,
      light: galileoDarkBlue.light,
      dark: galileoDarkBlue.dark
    }
  },
  overrides: {
    MuiDrawer,
    MuiListItem,
    MuiListItemText,
  },
  props: {
    MuiButtonBase
  }
});
