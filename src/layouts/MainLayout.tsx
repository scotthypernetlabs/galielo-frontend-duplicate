import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Dashboard, Market, Login, Station, Stations, Machines, Jobs } from '../pages';
import Logout from '../components/Logout';

type Props = {

};

type State = {

}

class MainLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/market" component={Market} />
        <Route exact path="/stations" component={Stations} />
        <Route exact path="/stations/:id" component={Station} />
        <Route exact path="/machines" component={Machines} />
        <Route exact path="/jobs" component={Jobs} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
      </Switch>
    )
  }
}

export default MainLayout;
