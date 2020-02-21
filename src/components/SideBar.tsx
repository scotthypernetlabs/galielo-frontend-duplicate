import {
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { Dispatch } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { withRouter } from "react-router-dom";
import React from "react";

interface Props extends WithStyles<typeof styles> {
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
  componentDidMount() {
    // this.context.userService.getStationInvites();
    // this.context.stationService.refreshStations();
    // const filters = new GetJobFilters(
    //   null,
    //   null,
    //   [this.props.currentUser.user_id],
    //   null,
    //   null,
    //   1,
    //   25
    // );
    // this.context.jobService.getJobs(filters);
    // this.context.machineRepository
    //   .getMachines(
    //     new GetMachinesFilter(null, [this.props.currentUser.user_id])
    //   )
    //   .then(response => {
    //     this.props.receiveCurrentUserMachines(response);
    //   });
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
                this.state.editName
                  ? this.editNameForm()
                  : this.props.currentUser.username
              }
              onClick={this.editName}
            />
          </ListItem>
          {/* <ListItem*/}
          {/*  button={true}*/}
          {/*  onClick={this.changeViews('')}*/}
          {/*  selected={this.props.history.location.pathname === '/'}*/}
          {/* >*/}
          {/*  <FontAwesomeIcon icon={faThLarge} />*/}
          {/*  <ListItemText primary="Dashboard" />*/}
          {/* </ListItem>*/}
          <ListItem
            button={true}
            onClick={this.changeViews("stations")}
            selected={this.props.history.location.pathname === "/stations"}
          >
            <FontAwesomeIcon icon={faSitemap} />
            <ListItemText primary="Stations" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("jobs")}
            selected={this.props.history.location.pathname === "/jobs"}
          >
            <FontAwesomeIcon icon={faSuitcase} />
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("machines")}
            selected={this.props.history.location.pathname === "/machines"}
          >
            <FontAwesomeIcon icon={faDesktop} />
            <ListItemText primary="Machines" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews("notifications")}
            selected={this.props.history.location.pathname === "/notifications"}
          >
            <Badge color="error" badgeContent={stationInvites.length}>
              <FontAwesomeIcon icon={faBell} />
            </Badge>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
        <List style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <ListItem
            button={true}
            onClick={
              this.props.currentUser.user_id === "meme"
                ? this.changeViews("login")
                : this.changeViews("logout")
            }
          >
            <FontAwesomeIcon
              icon={
                this.props.currentUser.user_id === "meme"
                  ? faSignInAlt
                  : faSignOutAlt
              }
            />
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
  stationInvites: state.users.receivedStationInvites
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveCurrentUserMachines: (machines: Machine[]) =>
    dispatch(receiveCurrentUserMachines(machines))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SideBar))
);
