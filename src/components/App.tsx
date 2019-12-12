import * as React from 'react';
import { connect } from 'react-redux';
import { Route , Switch, RouteComponentProps } from 'react-router-dom';
import SideBar from './SideBar';
import Market from './Market';
import Login from './Login';
import Logout from './Logout';
import Modal from './Modals/Modal';
import Stations from './Stations/Stations';
import { logService } from './Logger';

type Props = {

};

type State = {

}

class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  public componentDidMount(){

  }
  public render(){
    logService.log("Log App Render");
    return(
      <div className="app">
        <div className="main">
          <Modal />
          <SideBar />
          <Switch>
            <Route exact path="/" component={Market} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/stations" component={Stations} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
