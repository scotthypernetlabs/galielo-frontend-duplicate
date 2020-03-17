import {
  Badge,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { Dispatch } from "redux";
import { GetJobFilters } from "../business/objects/job";
import { GetMachinesFilter, Machine } from "../business/objects/machine";
import { History } from "history";
import {
  IReceiveCurrentUserMachines,
  receiveCurrentUserMachines
} from "../actions/machineActions";
import { IStore } from "../business/objects/store";
import { MyContext } from "../MyContext";
import { User } from "../business/objects/user";
import { UserIconNew } from "./svgs/UserIconNew";
import { connect } from "react-redux";
import { context } from "../context";
import { createStyles } from "@material-ui/core/styles";
import {
  faBell,
  faDesktop,
  faSignInAlt,
  faSignOutAlt,
  faSitemap,
  faSuitcase,
  faThLarge
} from "@fortawesome/free-solid-svg-icons";
import { galileoDarkBlue } from "./theme";
import { withRouter } from "react-router-dom";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ComputerIcon from "@material-ui/icons/Computer";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import WorkIcon from "@material-ui/icons/Work";

interface Props extends WithStyles<typeof styles> {
  jobsSelected: boolean;
  notificationsSelected: boolean;
  currentUser: User;
  history: History<any>;
  stationInvites: string[];
  receiveCurrentUserMachines: (
    machines: Machine[]
  ) => IReceiveCurrentUserMachines;
}

type State = {
  expandStations: boolean;
  editName: boolean;
  currentName: string;
  version: string;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

const styles = () =>
  createStyles({
    noHover: {
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0)"
      }
    },
    defaultCursor: {
      cursor: "default",
      "& *": {
        cursor: "default"
      }
    }
  });

class SideBar extends React.Component<Props, State> {
  context!: MyContext;
  readonly state: State = {
    expandStations: false,
    editName: false,
    currentName: "",
    version: ""
  };
  constructor(props: Props) {
    super(props);
    this.changeViews = this.changeViews.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
  }

  public handleChange(type: keyof State) {
    return (e: any) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }
  changeViews(view: string) {
    return (e: any) => {
      this.props.history.push(`/${view}`);
    };
  }

  public editName(e: any) {
    // this.setState({
    //   editName: true,
    //   currentName: this.props.currentUser.username
    // })
  }
  public editNameForm() {
    return (
      <form>
        <TextField
          variant="outlined"
          size="small"
          onChange={this.handleChange("currentName")}
        />
        <div>
          <button onClick={this.handleEditName(true)}>Save</button>
          <button onClick={this.handleEditName(false)}>Discard</button>
        </div>
      </form>
    );
  }

  public handleEditName(saveEdit: boolean) {
    return (e: any) => {
      if (saveEdit) {
        // code to save edit
      } else {
        this.setState({
          editName: false
        });
      }
    };
  }

  public render() {
    const { classes, stationInvites } = this.props;
    return (
      <Drawer variant="permanent">
        <List>
          <ListItem
            classes={{
              button: classes.noHover,
              root: classes.defaultCursor
            }}
          >
            {UserIconNew("ONLINE", 40)}
            <ListItemText
              primary={
                this.state.editName ? (
                  this.editNameForm()
                ) : (
                  <Typography noWrap={true} style={{ width: "120%" }}>
                    {this.props.currentUser.username}
                  </Typography>
                )
              }
              onClick={this.editName}
            />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("dashboard")}
            selected={
              this.props.history.location.pathname === "/dashboard" ||
              this.props.history.location.pathname === "/"
            }
          >
            <DashboardIcon />
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            button={true}
            onClick={this.changeViews("stations")}
            selected={this.props.history.location.pathname === "/stations"}
          >
            <AccountTreeIcon />
            <ListItemText primary="Stations" />
          </ListItem>

          <ListItem
            button={true}
            onClick={this.changeViews("jobs")}
            selected={
              this.props.history.location.pathname === "/jobs" ||
              this.props.jobsSelected
            }
          >
            <WorkIcon />
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("machines")}
            selected={this.props.history.location.pathname === "/machines"}
          >
            <ComputerIcon />
            <ListItemText primary="Machines" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("notifications")}
            selected={
              this.props.history.location.pathname === "/notifications" ||
              this.props.notificationsSelected
            }
          >
            <Badge color="error" badgeContent={stationInvites.length}>
              <NotificationsIcon />
            </Badge>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button={true}>
            <Icon>info</Icon>
            <a
              href="https://galileoapp.io/gettingstarted/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItemText primary="Getting Started" />
            </a>
          </ListItem>
        </List>
        <List
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingBottom: 0
          }}
        >
          <ListItem
            button={true}
            onClick={
              this.props.currentUser.user_id === "meme"
                ? this.changeViews("login")
                : this.changeViews("logout")
            }
            style={{
              borderBottom: 0,
              borderTop: `1px solid ${galileoDarkBlue.light}`
            }}
          >
            <ExitToAppIcon />
            <ListItemText
              primary={
                this.props.currentUser.user_id === "meme" ? "Login" : "Logout"
              }
            />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}
// <button className={`view-results ${marketplace_active}`} onClick={this.changeViews('market')}>
//   <span><i className="fas fa-store"></i>Marketplace</span>
// </button>

SideBar.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
  stationInvites: state.users.receivedStationInvites,
  jobsSelected: state.jobs.jobsSelected,
  notificationsSelected: state.ui.notificationsSelected
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveCurrentUserMachines: (machines: Machine[]) =>
    dispatch(receiveCurrentUserMachines(machines))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SideBar))
);
