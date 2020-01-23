import React from 'react';
import { Machine } from '../../business/objects/machine';
import {MyContext} from "../../MyContext";
import {context} from "../../context";
import { getDroppedOrSelectedFiles } from './fileSelector';
import { Station } from '../../business/objects/station';
import ProgressBar from "../ProgressBar";

const fileUploadTextDefault = 'Browse or drop directory';

type Props = {
  machine: Machine;
  station: Station;
}

type State = {
  fileUploadText: string;
  fileUploadHover: boolean;
  disabled: boolean;
}

class StationMachine extends React.Component<Props, State> {
  context!: MyContext;
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
  async handleDrop(e: any){
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    const { machine, station } = this.props;
    if (disabled) return;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    this.setState({
      disabled: true,
      fileUploadText: 'Uploading your file.....'
    });
    let directoryName = e.dataTransfer.files[0].name;
    let files = await getDroppedOrSelectedFiles(e);
    this.context.jobService.sendJob('', machine.mid, files, directoryName, station.id);

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
    const { machine, station } = this.props;
    if(disabled) return;
    if(machine.status.toUpperCase() !== 'ONLINE'){
      return;
    }
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    // This feature should be supported but for some reason it isn't.
    // @ts-ignore
    // inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", (file) => {
      this.setState({
        fileUploadText: 'Uploading your file.....',
        disabled: true,
      })
      this.context.jobService.sendJob('', machine.mid, Array.from(inputElement.files), inputElement.files[0].name, station.id)
    })
    inputElement.dispatchEvent(new MouseEvent("click"));
  }
  render(){
    const { machine } = this.props;
    let machineClass = 'file-upload-machine';
    if(machine.status.toUpperCase() !== 'ONLINE'){
      machineClass += ' red';
    }
    let memory:string = '0';
    let cores:string = '0';
    if(machine.memory){
      memory = (parseInt(machine.memory) / 1e9).toFixed(1);
    }
    if(machine.cpu){
      cores = machine.cpu;
    }
    return(
      <div
        className={machineClass}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        onClick={this.handleClick}
        >
        <div>{machine.machine_name}</div>
        <div className="machine-details-icons">
          <i className="fas fa-sd-card">
            <div>{memory}GB</div>
          </i>
          <i className="fas fa-tachometer-fast">
            <div>{cores} Cores
            </div>
          </i>
        </div>
        <div>{this.state.fileUploadText} </div>
        <div>
          {this.state.fileUploadText === 'Uploading your file.....' && <ProgressBar mid={machine.mid}/>}
        </div>
      </div>
    )
  }
}
StationMachine.contextType = context;
export default StationMachine;
