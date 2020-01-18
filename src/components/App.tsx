import * as React from 'react';
import { connect } from 'react-redux';
import { Route , Switch, RouteComponentProps } from 'react-router-dom';
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

type Props = {

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
    logService.log("Log App Render");
    return(
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
    )
  }
}

App.contextType = context;

export default App;
