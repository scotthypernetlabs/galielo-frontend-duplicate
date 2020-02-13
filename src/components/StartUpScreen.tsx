import React from 'react';
import CSS from 'csstype';
import { connect } from 'react-redux';
import galileoIcon from '../images/galileo-icon.png';
import galileoBackground from '../images/galileo-background.jpg';
import { IStore } from '../business/objects/store';
import { Dispatch } from 'redux';
import { MyContext } from '../MyContext';
import { context } from '../context';

type Props = {

}

type State = {
  loadDelay: boolean;
}

const backgroundStyle: CSS.Properties = {
  color: '#fff',
  width: "100%",
  height: "100vh",
  display: 'grid',
  alignItems: 'center',
  background: `url(${galileoBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'bottom',
  position: 'absolute',
  top: 0,
  zIndex: 11,
  paddingBottom: '8rem',
}

const headerStyle: CSS.Properties = {
  color: '#fff',
  textAlign: 'center'
}

const startupContainer: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginLeft: 'auto',
  marginRight: 'auto'
}

const imgContainer: CSS.Properties = {
  alignItems: 'center',
  margin: 'auto'
}

class StartUpScreen extends React.Component<Props, State> {
  context!: MyContext;
  timeout: any;
  constructor(props: Props){
    super(props);
    this.state = {
      loadDelay: true
    }
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentDidMount(){
    this.timeout = setTimeout(() => {
      this.setState({
        loadDelay: false
      })
    }, 3000)
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
  handleLogin(){
    let url = this.context.auth_service.getAuthenticationUrl();
    window.location.href = url;
  }
  render(){
    if(this.state.loadDelay){
      return(
        <div style={backgroundStyle}>
          <img src={galileoIcon} className="startup-icon" alt="Galileo Icon"></img>
          <span className="startup-spinner"> </span>
        </div>
      )
    }
    return(
      <div style={backgroundStyle}>
        <div style={startupContainer}>
          <div style={imgContainer}>
            <img src={galileoIcon} className="startup-icon" alt="Galileo Icon"></img>
          </div>
          <h1 style={headerStyle}> Welcome to Galileo! </h1>
          <h2 style={headerStyle}> The easiest way to deploy any code </h2>
          <button className="primary-btn" onClick={this.handleLogin}>LOG IN</button>
        </div>
      </div>
    )
  }
}

StartUpScreen.contextType = context;

const mapStateToProps = (state:IStore) => ({
  currentUser: state.users.currentUser
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StartUpScreen);
