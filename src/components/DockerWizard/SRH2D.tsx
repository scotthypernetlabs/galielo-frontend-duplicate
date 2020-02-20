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
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  state: DockerInputState;
};

type State = {};

class SRH2DWizard extends React.Component<Props, State> {
  componentDidMount() {
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
    let fileString =
      frameworkExplanation +
      `FROM hyperdyne/simulator:${this.props.state.selectedFramework.value}\n\n#The line below determines the location to copy from and the location to copy to \n\n`;
    fileString += `COPY . C:\\\\data`;
    this.props.receiveDockerInput({
      entrypoint: "set",
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
export default connect(mapStateToProps, mapDispatchToProps)(SRH2DWizard);
