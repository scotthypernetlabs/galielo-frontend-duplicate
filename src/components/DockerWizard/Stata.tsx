// stata
import { Box, TextField } from "@material-ui/core";
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

type State = {
  target: string;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class StataWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      target: ""
    };
    this.handleStateInput = this.handleStateInput.bind(this);
    this.handleAddEntrypoint = this.handleAddEntrypoint.bind(this);
    this.handleAddDependency = this.handleAddDependency.bind(this);
    this.generateBuildCommands = this.generateBuildCommands.bind(this);
  }
  componentDidMount() {
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
    const fileString =
      frameworkExplanation +
      `FROM hypernetlabs/stata:16batch\n\nCOPY . /data\n\n`;
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
          <form
            className="entrypoint-form"
            onSubmit={this.handleAddEntrypoint}
            onBlur={this.handleAddEntrypoint}
          >
            <Box mt={5}>
              <TextField
                id="outlined-basic"
                label="Executable Path"
                variant="outlined"
                value={this.state.target}
                type="text"
                onChange={this.handleStateInput("target")}
                onMouseDown={e => e.stopPropagation()}
                placeholder="ex: bootstrap"
              />
            </Box>
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
    if (newDockerTextFile.indexOf("ENV DOFILE=") > 0) {
      newDockerTextFile = newDockerTextFile.slice(
        0,
        newDockerTextFile.indexOf("ENV DOFILE=")
      );
      newDockerTextFile += `ENV DOFILE=${target}`;
    } else {
      newDockerTextFile += `\n#The entrypoint is the command used to start your project\n\nENV DOFILE=${target}`;
    }
    this.props.receiveDockerInput({
      entrypoint: "set",
      dockerTextFile: newDockerTextFile
    });
  }
  handleAddDependency(e: any) {
    e.preventDefault();
    const { dependencyInput, frameworkText } = this.props.state;
    let newText: string = "";
    const startText = `#The next block determines what dependencies to load\n\n`;
    const parsedDependencies = dependencyInput.split(", ");
    parsedDependencies.forEach(dependency => {
      newText += `RUN stata-mp -b "ssc install ${dependency}"\n`;
    });
    const finalText = frameworkText + startText + newText;
    this.props.receiveDockerInput({
      dockerTextFile: finalText,
      dependencyInput: e.target.value
    });
  }
  generateBuildCommands() {
    return (
      <>
        <form
          onSubmit={this.handleAddDependency}
          onBlur={this.handleAddDependency}
        >
          <Box mt={5}>
            <TextField
              id="outlined-basic"
              label="Manually input required dependencies"
              variant="outlined"
              className="julia-dep-input"
              value={this.props.state.dependencyInput}
              type="text"
              onChange={this.handleInput("dependencyInput")}
              onMouseDown={e => e.stopPropagation()}
              placeholder={`ex:mixlogit, dataframe`}
            />
          </Box>
        </form>
      </>
    );
  }
  render() {
    return (
      <>
        <div className="build-commands-container">
          {this.generateBuildCommands()}
        </div>
        <div className="entrypoint-container">{this.generateEntrypoint()}</div>
      </>
    );
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
