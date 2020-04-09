import { Dispatch } from "redux";
import { DockerWizardOptions } from "../../../business/objects/dockerWizard";
import {
  IOpenDockerWizard,
  openDockerWizard
} from "../../../actions/modalActions";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../../../actions/stationActions";
import { IStore } from "../../../business/objects/store";
import { MyContext } from "../../../MyContext";
import { PackagedFile } from "../../../business/objects/packagedFile";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { Webkit } from "../../Modals/AddMachineModal/AddMachineModal";
import { connect } from "react-redux";
import { context } from "../../../context";
import { getDroppedOrSelectedFiles } from "../fileSelector";
import React from "react";
import StationBoxView from "./StationBoxView";

const fileUploadTextDefault = "Browse or drop directory";

type Props = {
  pending: boolean;
  station: Station;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
  currentUser: User;
  history: any;
  openDockerWizard: (
    directoryName: string,
    options: DockerWizardOptions
  ) => IOpenDockerWizard;
};

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
  hover: boolean;
  identity: string;
};

class StationBox extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      dragOver: false,
      disabled: false,
      fileUploadText: fileUploadTextDefault,
      fileUpload: false,
      hover: false,
      identity: "Station Box"
    };
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleRunJobClick = this.handleRunJobClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  componentDidMount() {
    this.context.uploadQueue.bindComponent(this, this.state.identity);
  }
  componentWillUnmount() {
    this.context.uploadQueue.removeComponent(this.state.identity);
  }
  handleMouseOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      hover: true
    });
  }

  handleMouseOut(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      hover: false
    });
  }

  handleOpenStation(station: Station) {
    return () => {
      this.props.history.push(`/stations/${station.id}`);
      this.props.receiveSelectedStation(station);
    };
  }

  handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      fileUploadText: "Drop to send a directory",
      dragOver: true
    });
  }

  handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      fileUploadText: fileUploadTextDefault,
      dragOver: false
    });
  }

  async handleDrop(e: any, station: Station) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      fileUploadText: "Queued...",
      fileUpload: true
    });
    const directoryName = e.dataTransfer.files[0].name;
    const files = await getDroppedOrSelectedFiles(e);
    const filteredJobs: any = {};
    files.forEach((packagedFile: PackagedFile) => {
      const rootDirectory = packagedFile.fullPath.slice(
        1,
        packagedFile.fullPath.indexOf("/", 1)
      );
      const path = packagedFile.fullPath.replace(`${rootDirectory}/`, "");
      packagedFile = Object.assign({}, packagedFile, {
        fullPath: path.slice(1)
      });
      if (filteredJobs[rootDirectory]) {
        filteredJobs[rootDirectory].push(packagedFile);
      } else {
        filteredJobs[rootDirectory] = [packagedFile];
      }
    });
    if (Object.keys(filteredJobs).length === 0) {
      this.props.openDockerWizard(
        "",
        new DockerWizardOptions("station", [], "", station.id)
      );
    }
    Object.keys(filteredJobs).forEach((directory_name: string) => {
      const files = filteredJobs[directory_name];
      const sendJobFunction = async () => {
        await this.context.jobService.sendStationJob(
          station.id,
          files,
          directory_name
        );
        this.setState({
          fileUploadText: fileUploadTextDefault,
          fileUpload: false,
          dragOver: false
        });
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
    });
    this.context.uploadQueue.startQueue();
  }

  handleRunJobClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { station } = this.props;
    const inputElement: Webkit = document.createElement("input");
    inputElement.type = "file";
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", async file => {
      this.setState({
        fileUploadText: "Queued..."
      });
      const firstFile = inputElement.files[0];
      // @ts-ignore
      const fullPath = firstFile.webkitRelativePath;
      const directoryName = fullPath.slice(
        0,
        fullPath.indexOf(`/${firstFile.name}`)
      );
      const files = Array.from(inputElement.files);
      const formattedFiles = files.map(file => {
        return Object.assign(
          {},
          {
            fileObject: file,
            // @ts-ignore
            fullPath: file.webkitRelativePath.replace(`${directoryName}/`, "")
          }
        );
      });
      const sendJobFunction = async () => {
        await this.context.jobService.sendStationJob(
          station.id,
          formattedFiles,
          directoryName
        );
        this.setState({
          fileUploadText: fileUploadTextDefault
        });
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
    });
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  render() {
    const { station, pending } = this.props;
    const { hover, dragOver, fileUploadText, fileUpload } = this.state;
    return (
      <StationBoxView
        handleOpenStation={this.handleOpenStation(station)}
        station={station}
        handleDragOver={this.handleDragOver}
        handleDragLeave={this.handleDragLeave}
        handleDrop={(e: any) => this.handleDrop(e, station)}
        handleMouseOver={this.handleMouseOver}
        handleMouseOut={this.handleMouseOut}
        hover={hover}
        handleRunJobClick={this.handleRunJobClick}
        dragOver={dragOver}
        fileUpload={fileUpload}
        fileUploadText={fileUploadText}
        pending={pending}
      />
    );
  }
}

StationBox.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station)),
  openDockerWizard: (directoryName: string, options: DockerWizardOptions) =>
    dispatch(openDockerWizard(directoryName, options))
});

export default connect(mapStateToProps, mapDispatchToProps)(StationBox);
