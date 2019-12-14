import React from 'react';
import store from './store/store';
import 'antd/dist/antd.css';
import './index.scss';
import { Root } from './root';
import { MyContext } from './MyContext';
import { IAuthService } from './business/interfaces/IAuthService';

import {context} from './context';
import { ISettingsRepository } from './data/interfaces/ISettingsRepository';

type Props = {
  router: any;
  auth: IAuthService;
  settings: ISettingsRepository;
}

type State = {
  loaded: boolean;
}

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

    this.context.initialize(settings, auth_service);
    this.setState({
      loaded: true
    })
  }
  render(){
    if(!this.state.loaded){
      return(
        <>
          Loading
        </>
      )
    }
    return(
      <Root store={store} router={this.props.router}/>
    )
  }
}

GalileoFrontend.contextType = context;

export default GalileoFrontend;
