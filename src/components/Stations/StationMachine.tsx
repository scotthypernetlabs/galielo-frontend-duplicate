import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Machine } from '../../business/objects/machine';

const fileUploadTextDefault = 'Browse or drop directory';

type Props = {
  machine: Machine;
  station: any;
}

type State = {
  fileUploadText: string;
  fileUploadHover: boolean;
  disabled: boolean;
}

class StationMachine extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      fileUploadText: fileUploadTextDefault,
      fileUploadHover: false,
      disabled: false
    }
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleDragOver(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    const { machine } = this.props;
    const { fileUploadText, fileUploadHover, disabled } = this.state;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    if(fileUploadText === 'Drop to send a directory' && fileUploadHover) return;
    this.setState({
      fileUploadText: 'Drop to send a directory',
      fileUploadHover: true
    })
  }
  handleDragLeave(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    const { machine } = this.props;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    const { fileUploadText, fileUploadHover, disabled } = this.state;
    if (disabled) return;
    if(fileUploadText === fileUploadTextDefault && !fileUploadHover) return;
    this.setState({
      fileUploadText: fileUploadTextDefault,
      fileUploadHover: false
    });
  }
  handleDrop(e: any){
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    const { machine } = this.props;
    if (disabled) return;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    this.setState({
      disabled: true,
      fileUploadText: 'Uploading your file.....'
    })
    let filePath = e.dataTransfer.files[0].path;
    // sendJob(filePath, machine.id, this.props.group.id)
    //   .then((job_id) => {
    //     this.setState({
    //       fileUploadText: fileUploadTextDefault,
    //       disabled: false
    //     })
    //   })
    //   .catch((err) => {
    //     if(err.code === 86951336428398356618){
    //       this.props.openDockerWizard(filePath);
    //       this.setState({
    //         fileUploadText: fileUploadTextDefault,
    //         disabled: false
    //       })
    //       return;
    //     }
    //     this.props.openNotificationModal(`Failed to upload directory... ${err.err_text}`);
    //     this.setState({
    //       fileUploadText: fileUploadTextDefault,
    //       disabled: false
    //     })
    //   })
  }
  handleClick(e:React.MouseEvent){
    e.preventDefault();
    const { disabled } = this.state;
    const { machine } = this.props;
    if(disabled) return;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    // This feature should be supported but for some reason it isn't.
    // @ts-ignore
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", (file) => {
      this.setState({
        fileUploadText: 'Uploading your file.....',
        disabled: true,
      })
      // sendJob(inputElement.files[0].path, machine.id, this.props.group.id)
      //   .then((job_id) => {
      //     this.setState({
      //       fileUploadText: fileUploadTextDefault,
      //       disabled: false
      //     })
      //   })
      //   .catch((err) => {
      //     if(err.code === 86951336428398356618){
      //       this.props.openDockerWizard(inputElement.files[0].path);
      //       this.setState({
      //         fileUploadText: fileUploadTextDefault,
      //         disabled: false
      //       })
      //       return;
      //     }
      //     this.props.openNotificationModal(`Failed to upload directory... ${err.err_text}`);
      //     this.setState({
      //       fileUploadText: fileUploadTextDefault,
      //       disabled: false
      //     })
      //   })
    })
    inputElement.dispatchEvent(new MouseEvent("click"));
  }
  render(){
    const { machine } = this.props;
    return(
      <div
        className="file-upload-machine"
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        onClick={this.handleClick}
        >
        <div>{machine.machine_name}</div>
        <div className="machine-details-icons">
          <i className="fas fa-sd-card">
            <div>{machine.memory}GB</div>
          </i>
          <i className="fas fa-tachometer-fast">
            <div>{machine.memory} Cores
            </div>
          </i>
        </div>
        <div>{this.state.fileUploadText} </div>
      </div>
    )
  }
}

export default StationMachine;
