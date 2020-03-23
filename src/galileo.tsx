import "./index.scss";
import "antd/dist/antd.css";
import { IAuthService } from "./business/interfaces/IAuthService";
import { ISettingsRepository } from "./data/interfaces/ISettingsRepository";
import { MyContext } from "./MyContext";
import { Root } from "./root";
import { context } from "./context";
import React from "react";
import store from "./store/store";

type Props = {
  router: any;
  auth: IAuthService;
  settings: ISettingsRepository;
};

type State = {
  loaded: boolean;
};

class GalileoFrontend extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentDidMount() {
    const settings = this.props.settings;
    const auth_service = this.props.auth;

    this.context.initialize(settings, auth_service);
    this.setState({
      loaded: true
    });
  }
  render() {
    if (!this.state.loaded) {
      return <>Loading</>;
    }
    return <Root store={store} router={this.props.router} />;
  }
}

GalileoFrontend.contextType = context;

export default GalileoFrontend;
