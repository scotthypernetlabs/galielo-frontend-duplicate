/*
This fule is purely a template for what a Wizard will likely contain
*/

import { Dispatch } from "redux";
import {
  DockerInputState,
  IDockerInput
} from "../../business/objects/dockerWizard";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";
import { connect } from "react-redux";
import React from "react";

type Props = {
  state: DockerInputState;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
};

type State = {};

class Wizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
    const fileString = frameworkExplanation + `FROM framework\n\n`;
    this.props.receiveDockerInput({
      entrypoint: "",
      target: "",
      dependencyText: "",
      dependencyInput: "",
      dockerTextFile: fileString,
      frameworkText: fileString
    });
  }
  render() {
    return <></>;
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wizard);
