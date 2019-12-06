import * as React from 'react';
import { connect } from 'react-redux';
import { logService } from './Logger';
import { injectContext } from '../context';

type Props = {

}

type State = {

}

class Logout extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  public render(){
    const context = this.context;
    const settings = context.settings.getSettings();
    let url = `${settings.auth0Domain}/v2/logout?client_id=${settings.auth0ClientId}&returnTo=${settings.auth0RedirectUri}`;
    document.cookie = 'token= ; expires= Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = url;
    return(
      <div className="marketplace-container">
        <div className="stations-header">
          <h3>Logging out...</h3>
        </div>
      </div>
    )
  }
}

Logout.contextType = injectContext;

export default Logout;
