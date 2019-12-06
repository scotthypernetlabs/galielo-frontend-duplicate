import * as React from 'react';
import { connect } from 'react-redux';
import { RequestPromise } from '../utils/auth';
import { RequiredUriUrl } from 'request';
import { injectContext } from '../context';
import URL from 'url';
import qs from 'querystring';

type Props = {

}

type State = {

}

class Login extends React.Component<Props, State>{
  constructor(props: Props){
    super(props);
  }
  public render(){
    let context = this.context;
    let url = context.auth_service.getAuthenticationUrl();
    window.location.href = url;
    return(
      <div className="marketplace-container">
        <div className="stations-header">
          <h3>Logging in...</h3>
        </div>
      </div>
    )
  }
}

Login.contextType = injectContext;

export default Login;
