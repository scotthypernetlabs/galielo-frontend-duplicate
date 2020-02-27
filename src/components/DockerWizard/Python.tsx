import React from 'react';
import { connect } from 'react-redux';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import { IReceiveDockerInput, receiveDockerInput } from '../../actions/dockerActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { TextField, Box } from '@material-ui/core';

const fileUploadTextDefault = 'Browse or drop file';

type Props = {
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  state: DockerInputState;
}

type State = {

}

class PythonWizard extends React.Component<Props, State> {
  constructor(props:Props){
    super(props);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadRequirementsFile = this.loadRequirementsFile.bind(this);
    this.handleAddDependency = this.handleAddDependency.bind(this);
    this.handleAddEntrypoint = this.handleAddEntrypoint.bind(this);
    this.generateEntrypoint = this.generateEntrypoint.bind(this);
    this.generateBuildCommands = this.generateBuildCommands.bind(this);
  }

  componentDidMount(){
    const frameworkExplanation = '#The line below determines the build image to use\n\n';
    let fileString = frameworkExplanation + `FROM ${this.props.state.selectedFramework.value}`;
    this.props.receiveDockerInput({
      entrypoint: '',
      target: '',
      dependencyText: '',
      dependencyInput: '',
      dockerTextFile: fileString,
      frameworkText: fileString
    });
  }

  componentDidUpdate(prevProps: Props, prevState:State){
    console.log(prevProps.state.selectedFramework);
    console.log(this.props.state.selectedFramework);
    if(prevProps.state.selectedFramework && prevProps.state.selectedFramework.value !== this.props.state.selectedFramework.value){
      const frameworkExplanation = '#The line below determines the build image to use\n\n';
      let fileString = frameworkExplanation + `FROM ${this.props.state.selectedFramework.value}`;
      this.props.receiveDockerInput({
        entrypoint: '',
        target: '',
        dependencyText: '',
        dependencyInput: '',
        dockerTextFile: fileString,
        frameworkText: fileString
      });
    }
  }

  handleDragOver(e:any){
    e.preventDefault();
    e.stopPropagation();
    const { fileUploadText, fileUploadHover, disabled } = this.props.state;
    e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
    if (disabled) return;

    // Prevent setState from running
    if (fileUploadText === 'Drop to add directory' && fileUploadHover) return;
    this.props.receiveDockerInput({
      fileUploadText: 'Drop to add directory',
      fileUploadHover: true,
    });
  }

  handleDragLeave(e:any){
    e.preventDefault();
    e.stopPropagation();

    const { fileUploadText, fileUploadHover, disabled } = this.props.state;
    if (disabled) return;

    // Prevent setState from running
    if (fileUploadText === fileUploadTextDefault && !fileUploadHover) return;

    this.props.receiveDockerInput({
      fileUploadText: fileUploadTextDefault,
      fileUploadHover: false,
    });
  };

  handleDrop(e:any){
    e.preventDefault();
    e.stopPropagation();

    const { disabled } = this.props.state;
    if (disabled) return;
    // command to send job to middleware
    this.loadRequirementsFile(e.dataTransfer.files[0]);

    this.props.receiveDockerInput({
      fileUploadText: "Uploading...",
      disabled: true
    });
  }

  handleClick(e:any){
    e.preventDefault();
    if(this.props.state.disabled){
      return;
    }
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    // inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", (file) => {
      this.props.receiveDockerInput({
        fileUploadText: "Uploading...",
        disabled: true,
      })
      this.loadRequirementsFile(inputElement.files[0]);
    })
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  handleInput(type:keyof IDockerInput){
    return(e:any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      })
    }
  }

  generateBuildCommands(){
    return(
      <>
        <div
          className='file-upload'
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
          onDragLeave={this.handleDragLeave}
          onClick={this.handleClick}
          >
          {this.props.state.fileUploadText}
        </div>
        <form onBlur={this.handleAddDependency}>
          <Box mt = {5}>
            <TextField id="outlined-basic" label="Manually input required dependencies" variant="outlined"
              className="julia-dep-input"
              value={this.props.state.dependencyInput}
              type="text"
              onChange={this.handleInput('dependencyInput')}
              placeholder="ex:numpy, matplotlib"
            />
          </Box>
        </form>
      </>
    )
  }
  loadRequirementsFile(file: File){
    const fileReader = new FileReader();
    const { frameworkText } = this.props.state
    fileReader.onload = (fileLoadedEvent) => {
      //@ts-ignore
      let textFromFileLoaded:string = fileLoadedEvent.target.result;
      let newDockerTextFile = frameworkText;
      let lines = textFromFileLoaded.split(/[\r\n]+/g);
      let newText = '\n\n#The next block determines what dependencies to load\n\nRUN';
      lines.forEach((line:string, idx:number) => {
        if(idx === 0){
          newText += ` pip3 install ${line}\n`;
        }else{
          newText += `RUN pip3 install ${line}\n`;
        }
      })
      newDockerTextFile += newText;
      newDockerTextFile += '\n#This line determines where to copy project files from, and where to copy them to\n\nCOPY . .\n';
      this.props.receiveDockerInput({
        fileUploadText: fileUploadTextDefault,
        disabled: false,
        dockerTextFile: newDockerTextFile,
        dependencyText: newText
      })
    };
    fileReader.readAsText(file, "UTF-8");
  }

  handleAddDependency(e:any){
    e.preventDefault();
    const { dependencyText, dependencyInput, frameworkText, } = this.props.state;
    if(dependencyInput.length === 0){
      return;
    }
    let newText = '';
    let finalText;
    let copyText = '\n#This line determines where to copy project files from, and where to copy them to\n\nCOPY . .\n';
    let startText = `\n\n#The next block determines what dependencies to load\n\n`;
    if(dependencyText.length === 0){
      let parsedDependencies = dependencyInput.split(', ');
      parsedDependencies.forEach(dependency => {
        newText += `RUN pip3 install ${dependency.replace(/'/g, "").replace(/"/g, "")}\n`;
      })
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: ''
      })
    }else{
      let parsedDependencies = dependencyInput.split(', ');
      newText = dependencyText;
      parsedDependencies.forEach(dependency => {
        newText += `RUN pip3 install ${dependency.replace(/'/g, "").replace(/"/g,"")}\n`;
      })
      finalText = frameworkText + startText + newText + copyText;
      this.props.receiveDockerInput({
        dependencyText: newText,
        dockerTextFile: finalText,
        dependencyInput: ''
      })
    }
  }

  handleAddEntrypoint(e:any){
    e.preventDefault();
    const { target, dockerTextFile } = this.props.state;
    if(target.length === 0){
      this.props.receiveDockerInput({
        entrypoint: '',
      })
      return;
    }
    let entrypointArray = target.split(' ');
    let newDockerTextFile = dockerTextFile;
    if(newDockerTextFile.indexOf('ENTRYPOINT') > 0){
      newDockerTextFile = newDockerTextFile.slice(0, newDockerTextFile.indexOf('ENTRYPOINT'));
    }
    newDockerTextFile += `\n#The entrypoint is the command used to start your project\n\nENTRYPOINT ["${entrypointArray.join('","')}"]`;
    this.props.receiveDockerInput({
      entrypoint: "set",
      dockerTextFile: newDockerTextFile
    })
  }

  generateEntrypoint(){
    const { selectedFramework, dependencyText } = this.props.state;
    if(selectedFramework && dependencyText.length > 0){
      return(
          <div className="entrypoint-container">
            <form className="entrypoint-form" onBlur={this.handleAddEntrypoint}>
              <Box mt = {5}>
                <TextField id="outlined-basic" label="Launch Command" variant="outlined"
                  value={this.props.state.target}
                  type="text"
                  onChange={this.handleInput('target')}
                  placeholder="ex: python train.py --dataset /dir/dataset --epochs 100"
                />
              </Box>
            </form>
          </div>
      )
    }
  }

  render(){
    return(
      <>
        <div className="build-commands-container">
          {this.generateBuildCommands()}
        </div>
        <div className="entrypoint-container">
          {this.generateEntrypoint()}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  state: state.docker.inputState
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveDockerInput: (object:IDockerInput) => dispatch(receiveDockerInput(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(PythonWizard);
