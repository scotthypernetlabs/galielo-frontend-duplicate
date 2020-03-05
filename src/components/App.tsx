import * as React from "react";
import { IStore } from "../business/objects/store";
import { MyContext } from "../MyContext";
import { Redirect, Route, Switch } from "react-router-dom";
import { Theme } from "./theme";
import { ThemeProvider } from "@material-ui/core";
import { User } from "../business/objects/user";
import { connect } from "react-redux";
import { context } from "../context";
import { logService } from "./Logger";
import Dashboard from "./Dashboard";
import Jobs from "./Jobs/Jobs";
import Login from "./Login";
import Logout from "./Logout";
import Machines from "./Machines/Machines";
import Market from "./Market";
import Modal from "./Modals/Modal";
import Notifications from "./Notifications";
import SideBar from "./SideBar";
import StartUpScreen from "./StartUpScreen";
import Station from "./Stations/Station/Station";
import Stations from "./Stations/Stations/Stations";

type Props = {
  currentUser: User;
  loaded: boolean;
};

type State = {};

class App extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
  }
  public componentDidMount() {}
  public render() {
    return (
      <ThemeProvider theme={Theme}>
        {!this.props.loaded ? (
          <StartUpScreen />
        ) : (
          <div className="app">
            <div className="main">
              <Modal />
              <SideBar />
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/market" component={Market} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/stations" component={Stations} />
                <Route exact path="/stations/:id" component={Station} />
                <Route exact path="/machines" component={Machines} />
                <Route exact path="/jobs" component={Jobs} />
                <Route exact path="/notifications" component={Notifications} />
              </Switch>
            </div>
          </div>
        )}
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
  loaded: state.ui.loadFinished
});

App.contextType = context;

export default connect(mapStateToProps)(App);
