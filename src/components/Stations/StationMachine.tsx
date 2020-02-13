import React from 'react';
import { Machine } from '../../business/objects/machine';
import {MyContext} from "../../MyContext";
import {context} from "../../context";
import { getDroppedOrSelectedFiles } from './fileSelector';
import { Station } from '../../business/objects/station';
import ProgressBar from "../ProgressBar";
import {IStore} from "../../business/objects/store";
import {connect} from "react-redux";
import {Dictionary} from "../../business/objects/dictionary";
import LandingZone from "../Machines/LandingZone";
import {User} from "../../business/objects/user";

const fileUploadTextDefault = 'Browse or drop directory';

type Props = {
  machine: Machine;
  station: Station;
  currentUser: User;
  progress: Dictionary<number>;
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
  componentDidUpdate(prevProps: Props, prevState: State): void {
    let doneUploading = this.props.progress === undefined && prevProps.progress !== undefined;
    if(doneUploading) {
      this.setState({
        fileUploadText: fileUploadTextDefault,
        disabled: false
      })
    }
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
    files = files.map( (file:any) => {
      return Object.assign({}, file, {fullPath: file.fullPath.slice(1)})
    })
    let jobUploaded = await this.context.jobService.sendJob('', machine.mid, files, directoryName, station.id);
    this.setState({
      fileUploadText: fileUploadTextDefault,
      disabled: false
    })
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
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", async(file) => {
      this.setState({
        fileUploadText: 'Uploading your file.....',
        disabled: true,
      })
      let firstFile = inputElement.files[0];
      //@ts-ignore
      let fullPath = firstFile.webkitRelativePath;
      let directoryName = fullPath.slice(0, fullPath.indexOf(`/${firstFile.name}`))
      let files = Array.from(inputElement.files);
      let formattedFiles = files.map(file => {
        // @ts-ignore
        return Object.assign({}, {fileObject: file, fullPath: file.webkitRelativePath})
      })
      let jobUploaded = await this.context.jobService.sendJob('', machine.mid, formattedFiles, directoryName, station.id)
      this.setState({
        fileUploadText: fileUploadTextDefault,
        disabled: false
      })
    })
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  render(){
    if (this.props.station.invited_list.includes(this.props.currentUser.user_id)) {
      return(
        <LandingZone
          machine={this.props.machine}
          station={false}
        />
      )
    }

    return(
      <div
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        onClick={this.handleClick}
        className="add-cursor"
      >
        <LandingZone
          machine={this.props.machine}
          station={true}
          fileUploadText={this.state.fileUploadText}
        />
      </div>
    )
  }
}

type ParentProps = {
  machine: Machine
}

const mapStateToProps = (store: IStore, ownProps: ParentProps) => ({
  progress: store.machines.uploadProgress[ownProps.machine.mid],
  progressTracker: store.machines.progressTracker[ownProps.machine.mid],
});

StationMachine.contextType = context;
export default connect(mapStateToProps)(StationMachine);
