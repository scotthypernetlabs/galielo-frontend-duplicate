/*
This fule is purely a template for what a Wizard will likely contain
*/

import React from 'react';
import { connect } from 'react-redux';
import { receiveDockerInput, IReceiveDockerInput } from '../../actions/dockerActions';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';

type Props = {
  state: DockerInputState;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
}

type State = {

}

class Wizard extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }

  componentDidMount(){
    const frameworkExplanation = '#The line below determines the build image to use\n\n';
    let fileString = frameworkExplanation + `FROM framework\n\n`;
    this.props.receiveDockerInput({
      entrypoint: '',
      target: '',
      dependencyText: '',
      dependencyInput: '',
      dockerTextFile: fileString,
      frameworkText: fileString
    });
  }
  render(){
    return(
      <>
      </>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  state: state.docker.inputState
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveDockerInput: (object:IDockerInput) => dispatch(receiveDockerInput(object))
})

export default connect(mapStateToProps, mapDispatchToProps)(Wizard);
