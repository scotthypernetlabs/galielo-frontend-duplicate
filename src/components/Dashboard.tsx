import React from 'react';
import { connect } from 'react-redux';
import path from 'path';
import {Redirect} from "react-router";

type Props = {

}

type State = {

}

class Onboarding extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);

  }
  render(){
      return(
        <Redirect to="/stations" />
      )
  }
}

export default Onboarding;
