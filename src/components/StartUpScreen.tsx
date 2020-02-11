import React from 'react';
import CSS from 'csstype';
import { connect } from 'react-redux';
import galileoIcon from '../images/galileo-icon.png';
import galileoBackground from '../images/galileo-background.jpg';
import { IStore } from '../business/objects/store';
import { Dispatch } from 'redux';

type Props = {

}

type State = {

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


class StartUpScreen extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  render(){
    return(
      <div style={backgroundStyle}>
        <img src={galileoIcon} className="startup-icon" alt="Galileo Icon"></img>
        <h1 style={headerStyle}> Welcome to Galileo! </h1>
        <h2 style={headerStyle}> The easiest way to deploy any code </h2>
        <button className="primary-btn">LOG IN</button>
      </div>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  currentUser: state.users.currentUser
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StartUpScreen);
