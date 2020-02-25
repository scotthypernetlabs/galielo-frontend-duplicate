import React from 'react';
import store from './store/store';
import 'antd/dist/antd.css';
import './index.scss';
import { Root } from './root';
import { MyContext } from './MyContext';
import { IAuthService } from './business/interfaces/IAuthService';
import {context} from './context';
import { ISettingsRepository } from './data/interfaces/ISettingsRepository';
import { Auth0Provider, Auth0RedirectState } from "./business/implementations/Auth0Service";
import history from "./utils/history";

let config = require('./config/config.local.json');
                                                                       
type Props = {
  router: any;
  auth: IAuthService;
  settings: ISettingsRepository;
}

type State = {
  loaded: boolean;
}

const onRedirectCallback = (appState: Auth0RedirectState) => {
  history.push( '/stations');
};

class GalileoFrontend extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      loaded: false
    }
  }

  componentDidMount(){
    let settings = this.props.settings;
    let auth_service = this.props.auth;
    console.log('initilizing')
    this.context.initialize(settings, auth_service);
    this.setState({
      loaded: true
    })
    console.log(config)
  }

  render(){
    if(!this.state.loaded){
      return(
          <Auth0Provider
            domain={config.AUTH0_DOMAIN}
            client_id={config.AUTH0_CLIENT_ID}
            redirect_uri={config.AUTH0_REDIRECT_URI}
            onRedirectCallback={onRedirectCallback}
          >     
         <div>
          Loading
        </div>
        </Auth0Provider>
      )
    }
    return(
      <Auth0Provider
        domain={config.AUTH0_DOMAIN}
        client_id={config.AUTH0_CLIENT_ID}
        redirect_uri={config.AUTH0_REDIRECT_URI}
        onRedirectCallback={onRedirectCallback}
      >    
        <Root store={store} router={this.props.router}/>
      </Auth0Provider>
    )
  }
}

GalileoFrontend.contextType = context;

export default GalileoFrontend;
