import * as React from 'react';
import { context } from '../../context';
import { MyContext } from '../../MyContext';

type Props = {

}

type State = {

}

class Login extends React.Component<Props, State>{
  context!: MyContext;

  constructor(props: Props) {
    super(props);
  }
  public render() {
    let context = this.context;
    let url = context.auth_service.getAuthenticationUrl();
    window.location.href = url;
    return (
      <div className="marketplace-container">
        <div className="stations-header">
          <h3>Logging in...</h3>
        </div>
      </div>
    )
  }
}

Login.contextType = context;

export default Login;
