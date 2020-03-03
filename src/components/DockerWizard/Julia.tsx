import React from 'react';
import { connect } from 'react-redux';
import { receiveDockerInput, IReceiveDockerInput } from '../../actions/dockerActions';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import { TextField, Box } from '@material-ui/core';

type Props = {
  state: DockerInputState;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
};

type State = {};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class JuliaWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleAddDependency = this.handleAddDependency.bind(this);
    this.handleAddEntrypoint = this.handleAddEntrypoint.bind(this);
    this.generateEntrypoint = this.generateEntrypoint.bind(this);
    this.generateBuildCommands = this.generateBuildCommands.bind(this);
  }

  componentDidMount() {
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
    const fileString =
      frameworkExplanation +
      `FROM julia:${this.props.state.selectedFramework.value}`;
    this.props.receiveDockerInput({
      entrypoint: "",
      target: "",
      dependencyText: "",
      dependencyInput: "",
      dockerTextFile: fileString,
      frameworkText: fileString
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    console.log(prevProps.state.selectedFramework);
    console.log(this.props.state.selectedFramework);
    if (
      prevProps.state.selectedFramework &&
      prevProps.state.selectedFramework.value !==
        this.props.state.selectedFramework.value
    ) {
      const frameworkExplanation =
        "#The line below determines the build image to use\n\n";
      const fileString =
        frameworkExplanation +
        `FROM julia:${this.props.state.selectedFramework.value}`;
      this.props.receiveDockerInput({
        entrypoint: "",
        target: "",
        dependencyText: "",
        dependencyInput: "",
        dockerTextFile: fileString,
        frameworkText: fileString
      });
    }
  }

  handleInput(type: keyof IDockerInput) {
    return (e: any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      });
    };
  }

  handleAddDependency(e: any) {
    e.preventDefault();
    const { dependencyText, dependencyInput, frameworkText } = this.props.state;
    let newText: string;
    let finalText;
    const copyText =
      "\n#This line determines where to copy project files from, and where to copy them to\n\nCOPY . .\n";
    const startText = `\n\n#The next block determines what dependencies to load\n\n`;
    if (dependencyText.length === 0) {
      const parsedDependencies = dependencyInput.split(", ");
      newText = "";
      parsedDependencies.forEach(dependency => {
        newText += `RUN julia -e 'import Pkg; Pkg.add("${dependency}"); using ${dependency}'\n`;
      });
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: ""
      });
    } else {
      const parsedDependencies = dependencyInput.split(", ");
      newText = dependencyText;
      parsedDependencies.forEach(dependency => {
        newText += `RUN julia -e 'import Pkg; Pkg.add("${dependency}"); using ${dependency}'\n`;
      });
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: ""
      });
    }
  }

  generateBuildCommands(){
    return(
      <>
        <form onBlur={this.handleAddDependency}>
        <Box mt= {5}>
          <TextField  id="outlined-basic" label="Manually input required dependencies" variant="outlined"
              className="julia-dep-input"
              value={this.props.state.dependencyInput}
              type="text"
              onChange={this.handleInput('dependencyInput')}
            placeholder={`ex:LightGraphs, DataFrames, SpecialFunctions`}
          />
      </Box>
        </form>
      </>
    );
  }

  handleAddEntrypoint(e: any) {
    e.preventDefault();
    const { target, dockerTextFile } = this.props.state;
    const entrypointArray = target.split(" ");
    let newDockerTextFile = dockerTextFile;
    if (newDockerTextFile.indexOf("ENTRYPOINT") > 0) {
      newDockerTextFile = newDockerTextFile.slice(
        0,
        newDockerTextFile.indexOf("ENTRYPOINT")
      );
    }
    newDockerTextFile += `\n#The entrypoint is the command used to start your project\n\nENTRYPOINT ["${entrypointArray.join(
      '","'
    )}"]`;
    this.props.receiveDockerInput({
      entrypoint: "set",
      dockerTextFile: newDockerTextFile
    });
  }

  generateEntrypoint(){
    const { selectedFramework, dependencyText } = this.props.state;
    if(selectedFramework && dependencyText.length > 0){
      return(
          <div className="entrypoint-container">
            <form className="entrypoint-form" onBlur={this.handleAddEntrypoint}>
              <Box mt= {5}>
                  <TextField  id="outlined-basic" label="Launch Command" variant="outlined"
                      className="julia-dep-input"
                      value={this.props.state.target}
                      type="text"
                      onChange={this.handleInput('target')}
                      placeholder="ex: julia project1.jl small.csv outputgraph.gph"
                  />
            </Box>
            </form>
          </div>
      )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(JuliaWizard);
