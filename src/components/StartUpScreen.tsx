import React from 'react';
import CSS from 'csstype';
import { connect } from 'react-redux';
import galileoIcon from '../images/galileo-icon.png';
import galileoBackground from '../images/galileo-background.jpg';
import { IStore } from '../business/objects/store';
import { Dispatch } from 'redux';
import { MyContext } from '../MyContext';
import { context } from '../context';
import { User } from '../business/objects/user';
import { GetJobFilters } from '../business/objects/job';
import { GetMachinesFilter, Machine } from '../business/objects/machine';
import { IReceiveCurrentUserMachines, receiveCurrentUserMachines } from '../actions/machineActions';
import { finishLoading, IFinishLoading } from '../actions/uiActions';
import {Button, Grid} from "@material-ui/core";
// or
import { Modal } from '@material-ui/core';
import SimpleModal from "./Modals/SimpleModal/SimpleModal";


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
      loadDelay: true
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
    this.context.machineRepository
      .getMachines(
        new GetMachinesFilter(null, [this.props.currentUser.user_id])
      )
      .then(response => {
        this.props.receiveCurrentUserMachines(response);
      });
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
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.currentUser.user_id !== "meme" &&
      prevProps.currentUser.user_id === "meme"
    ) {
      console.log("Load runs");
      this.initialLoad();
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
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleLogin}
              >
                LOG IN / SIGN UP
              </Button>
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
