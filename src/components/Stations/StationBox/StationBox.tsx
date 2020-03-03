import { Dispatch } from "redux";
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
};

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
  hover: boolean;
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
      hover: false
    };
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleRunJobClick = this.handleRunJobClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
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
    const { disabled } = this.state;
    if (disabled) return;
    this.setState({
      fileUploadText: "Drop to send a directory",
      dragOver: true
    });
  }

  handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    if (disabled) return;
    this.setState({
      fileUploadText: fileUploadTextDefault,
      dragOver: false
    });
  }

  async handleDrop(e: React.DragEvent<HTMLDivElement>, station: Station) {
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    if (disabled) return;
    this.setState({
      disabled: true,
      fileUploadText: "Uploading your file.....",
      fileUpload: true
    });
    const directoryName = e.dataTransfer.files[0].name;
    let files = await getDroppedOrSelectedFiles(e);
    files = files.map((file: PackagedFile) => {
      const path = file.fullPath.replace(`${directoryName}/`, "");
      return Object.assign({}, file, { fullPath: path.slice(1) });
    });
    await this.context.jobService.sendStationJob(
      station.id,
      files,
      directoryName
    );
    this.setState({
      fileUploadText: fileUploadTextDefault,
      disabled: false,
      fileUpload: false
    });
  }

  handleRunJobClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    const { station } = this.props;
    if (disabled) return;
    const inputElement: Webkit = document.createElement("input");
    inputElement.type = "file";
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", async file => {
      this.setState({
        fileUploadText: "Uploading your file.....",
        disabled: true
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
      await this.context.jobService.sendStationJob(
        station.id,
        formattedFiles,
        directoryName
      );
      this.setState({
        fileUploadText: fileUploadTextDefault,
        disabled: false
      });
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
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStateToProps, mapDispatchToProps)(StationBox);
