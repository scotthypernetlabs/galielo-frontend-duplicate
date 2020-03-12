import { Dispatch } from 'redux';
import {
  DockerInputState,
  IDockerInput
} from '../../business/objects/dockerWizard';
import {
  IReceiveDockerInput,
  receiveDockerInput
} from '../../actions/dockerActions';
import { IStore } from '../../business/objects/store';
import { connect } from 'react-redux';
import React from 'react';
import { Box, TextField } from '@material-ui/core';

type Props = {
  state: DockerInputState;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
}

type State = {
  target: string;
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class StataWizard extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      target: ''
    }
    this.handleStateInput = this.handleStateInput.bind(this);
    this.handleAddEntrypoint = this.handleAddEntrypoint.bind(this);
  }
  componentDidMount(){
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
      const fileString =
        frameworkExplanation + `FROM hypernetlabs/stata:16\n\nCOPY . /data\n\n`;
        this.props.receiveDockerInput({
          entrypoint: "",
          target: "",
          dependencyText: "",
          dependencyInput: "",
          dockerTextFile: fileString,
          frameworkText: fileString
        });
  }
  handleInput(type: keyof IDockerInput) {
    return (e: any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      });
    };
  }
  handleStateInput(type: keyof State) {
    return (e: any) => {
      const { value } = e.target;
      this.setState(updateState(type, value));
    };
  }
  generateEntrypoint() {
    const { selectedFramework } = this.props.state;
    if (selectedFramework) {
      return (
        <div className="entrypoint-container">
          <form className="entrypoint-form" onSubmit={this.handleAddEntrypoint} onBlur={this.handleAddEntrypoint}>
            <label className="padded-text">Executable Path</label>
            <input
              value={this.state.target}
              type="text"
              onChange={this.handleStateInput("target")}
              placeholder="ex: bootstrap.do"
            />
          </form>
        </div>
      );
    }
  }
  handleAddEntrypoint(e: any) {
    e.preventDefault();
    const { dockerTextFile } = this.props.state;
    const { target } = this.state;
    let newDockerTextFile = dockerTextFile;
    if (newDockerTextFile.indexOf("ENTRYPOINT") > 0) {
      newDockerTextFile = newDockerTextFile.slice(
        0,
        newDockerTextFile.indexOf("ENTRYPOINT")
      );
    }
    newDockerTextFile +=
    `\n#The entrypoint is the command used to start your project\n\nENTRYPOINT ["/usr/local/stata16/stata-mp","/data/${target}"]`;
    this.props.receiveDockerInput({
      entrypoint: "set",
      dockerTextFile: newDockerTextFile
    });
  }
  render(){
    return(
      <>
        <div className="entrypoint-container">{this.generateEntrypoint()}</div>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(StataWizard);
