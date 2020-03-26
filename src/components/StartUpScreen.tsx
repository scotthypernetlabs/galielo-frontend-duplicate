import { Button, Grid } from "@material-ui/core";
import { Dispatch } from "redux";
import { GetJobFilters } from "../business/objects/job";
import { GetMachinesFilter, Machine } from "../business/objects/machine";
import { IFinishLoading, finishLoading } from "../actions/uiActions";
import {
  IReceiveCurrentUserMachines,
  receiveCurrentUserMachines
} from "../actions/machineActions";
import { IStore } from "../business/objects/store";
import { MyContext } from "../MyContext";
import { User } from "../business/objects/user";
import { connect } from "react-redux";
import { context } from "../context";
import CSS from "csstype";
import React from "react";
import galileoBackground from "../images/galileo-background.jpg";
import galileoIcon from "../images/galileo-icon.png";
// or
import { Modal } from "@material-ui/core";

// This file is written with inline styles due to typescript not being happy with
// scss && images

type Props = {
  currentUser: User;
  receiveCurrentUserMachines: (
    machines: Machine[]
  ) => IReceiveCurrentUserMachines;
  finishLoading: () => IFinishLoading;
};

type State = {
  loadDelay: boolean;
  isIE: boolean;
};

const backgroundStyle: CSS.Properties = {
  color: "#fff",
  width: "100%",
  height: "100vh",
  display: "grid",
  alignItems: "center",
  background: `url(${galileoBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  position: "absolute",
  top: 0,
  zIndex: 11,
  paddingBottom: "8rem"
};

const headerStyle: CSS.Properties = {
  color: "#fff",
  textAlign: "center"
};

const startupContainer: CSS.Properties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: "auto"
};

const imgContainer: CSS.Properties = {
  alignItems: "center",
  margin: "auto"
};

class StartUpScreen extends React.Component<Props, State> {
  context!: MyContext;
  timeout: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      loadDelay: true,
      isIE: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.initialLoad = this.initialLoad.bind(this);
  }
  async initialLoad() {
    await this.context.stationService.refreshStations();
    await this.context.userService.getStationInvites();
    const filters = new GetJobFilters(
      null,
      null,
      [this.props.currentUser.user_id],
      null,
      null,
      1,
      25
    );
    await this.context.jobService.getJobs(filters);
    const currentUserMachines = await this.context.machineRepository.getMachines(
      new GetMachinesFilter(null, [this.props.currentUser.user_id])
    );
    this.props.receiveCurrentUserMachines(currentUserMachines);
  }
  componentDidMount() {
    this.timeout = setTimeout(() => {
      if (this.props.currentUser.user_id === "meme") {
        this.setState({
          loadDelay: false
        });
      }
    }, 3000);
  }
  async componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.currentUser.user_id !== "meme" &&
      prevProps.currentUser.user_id === "meme"
    ) {
      await this.initialLoad();
      this.props.finishLoading();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  handleLogin() {
    const url = this.context.auth_service.getAuthenticationUrl();
    window.location.href = url;
  }

  async action() {
    await setTimeout(function() {}, 3000);
  }
  render() {
    if (this.state.loadDelay) {
      return (
        <div style={backgroundStyle}>
          <img src={galileoIcon} className="startup-icon" alt="Galileo Icon" />
          <span className="startup-spinner"> </span>
        </div>
      );
    }
    return (
      <div style={backgroundStyle}>
        <div style={startupContainer}>
          <div style={imgContainer}>
            <img
              src={galileoIcon}
              className="startup-icon"
              alt="Galileo Icon"
            />
          </div>
          <h1 style={headerStyle}> Welcome to Galileo! </h1>
          <h2 style={headerStyle}> The easiest way to deploy any code </h2>
          <Grid container justify="center">
            <Grid item>
              {!this.state.isIE && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleLogin}
                >
                  LOG IN / SIGN UP
                </Button>
              )}
              {this.state.isIE && (
                <h4 style={headerStyle}>
                  {" "}
                  Internet Explorer is not a Galileo supported browser. Chrome,
                  Firefox, Edge, or Safari is required to use Galileo. Download
                  and install one of these four browser for the best experience.{" "}
                </h4>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

StartUpScreen.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveCurrentUserMachines: (machines: Machine[]) =>
    dispatch(receiveCurrentUserMachines(machines)),
  finishLoading: () => dispatch(finishLoading())
});

export default connect(mapStateToProps, mapDispatchToProps)(StartUpScreen);
