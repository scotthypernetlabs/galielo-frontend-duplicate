import React from 'react';
import { connect } from 'react-redux';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import { IReceiveDockerInput, receiveDockerInput } from '../../actions/dockerActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { TextField, Box } from '@material-ui/core';
import { spacing } from '@material-ui/system';

type Props = {
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  state: DockerInputState;
};

type State = {
  cpuCount: number;
};

const updateState = <T extends number>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
})

const theme = {
  spacing: [0, 2, 3, 5, 8],
}


class RWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleAddDependency = this.handleAddDependency.bind(this);
    this.handleAddEntrypoint = this.handleAddEntrypoint.bind(this);
    this.generateEntrypoint = this.generateEntrypoint.bind(this);
    this.generateBuildCommands = this.generateBuildCommands.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCpuCount = this.handleCpuCount.bind(this);
    this.state = {
      cpuCount: 1
    };
  }

  componentDidMount() {
    const frameworkExplanation =
      "#The line below determines the build image to use\n\n";
    const fileString = frameworkExplanation + `FROM rocker/r-apt:bionic`;
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
  handleChange(type: keyof State) {
    return (e: any) => {
      const { value } = e.target;
      this.setState(updateState(type, value));
    };
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

  generateEntrypoint() {
    const { dependencyText } = this.props.state;
    if(dependencyText.length > 0){
      return(
          <div className="entrypoint-container">
            <form className="entrypoint-form" onSubmit = {this.handleAddEntrypoint}  onBlur={this.handleAddEntrypoint}>
              <Box mt = {5}>
              <TextField id="outlined-basic" label="Launch Command" variant="outlined"
                value={this.props.state.target}
                type="text"
                onChange={this.handleInput('target')}
                placeholder="ex: Rscript logistic_regression.R"
                />
              </Box>
              
            </form>
          </div>
      )
    }
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
      newText = `RUN R -e 'options(Ncpus = ${this.state.cpuCount})'\n`;
      parsedDependencies.forEach(dependency => {
        newText += `RUN apt-get update && apt-get install -y -qq r-cran-${dependency.toLowerCase()}\n`;
      });
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: e.target.value
      });
    } else {
      const parsedDependencies = dependencyInput.split(", ");
      newText = dependencyText;
      parsedDependencies.forEach(dependency => {
        newText += `RUN apt-get update && apt-get install -y -qq r-cran-${dependency.toLowerCase()}\n`;
      });
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: e.target.value
      });
    }
  }

  generateBuildCommands() {
    return (
      <>
        {/* <div className="padded-text">Manually input required dependencies</div> */}
        <form onSubmit = {this.handleAddDependency} onBlur={this.handleAddDependency}>
        <Box mt= {5}>
          <TextField  id="outlined-basic" label="Manually input required dependencies" variant="outlined"
              className="julia-dep-input"
              value={this.props.state.dependencyInput}
              type="text"
              onChange={this.handleInput('dependencyInput')}
              placeholder={`ex:vioplot, doParallel, xgboost`}
          />
      </Box>
          {/* <input
            className="julia-dep-input"
            value={this.props.state.dependencyInput}
            type="text"
            onChange={this.handleInput("dependencyInput")}
            placeholder={`ex:vioplot, doParallel, xgboost`}
            /> */}
        </form>
      </>
    );
  }
  handleCpuCount() {
    return (
      <>
      <form onSubmit = {this.handleChange('cpuCount')}  onBlur={this.handleChange('cpuCount')}>
      <Box mt= {5}>
      <TextField  id="outlined-basic" label="Cpu Count" variant="outlined"
          className="julia-dep-input"
          value={this.state.cpuCount}
          type="number"
          onChange={this.handleChange('cpuCount')}
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
          {this.handleCpuCount()}
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

export default connect(mapStateToProps, mapDispatchToProps)(RWizard);
