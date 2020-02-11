import * as React from 'react';
import { connect } from 'react-redux';
import { Route , Switch } from 'react-router-dom';
import SideBar from './SideBar';
import Market from './Market';
import Login from './Login';
import Logout from './Logout';
import Modal from './Modals/Modal';
import Stations from './Stations/Stations';
import Machines from './Machines/Machines';
import Dashboard from './Dashboard';
import Station from './Stations/Station';
import Jobs from './Jobs/Jobs';
import { logService } from './Logger';
import Notifications from './Notifications';
import { MyContext } from '../MyContext';
import { context } from '../context';
import {ThemeProvider} from "@material-ui/core";
import {Theme} from './theme';
import StartUpScreen from './StartUpScreen';
import { IStore } from '../business/objects/store';
import { User } from '../business/objects/user';

type Props = {
  currentUser: User;
};

type State = {

}

class App extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
  }
  public componentDidMount(){
    this.context.userService.getStationInvites();
  }
  public render(){
    if(this.props.currentUser.user_id === 'meme'){
      return(
        <StartUpScreen />
      )
    }
    return(
      <ThemeProvider theme={Theme}>
        <div className="app">
          <div className="main">
            <Modal />
            <SideBar />
            <Switch>
              <Route exact path="/" component={Dashboard} />
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
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser
})

App.contextType = context;

export default connect(mapStateToProps)(App);
