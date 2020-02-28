import { Dispatch } from "redux";
import {
  IOpenNotificationModal,
  openNotificationModal
} from "../../actions/modalActions";
import { IStore } from "../../business/objects/store";
import { Machine } from "../../business/objects/machine";
import { MyContext } from "../../MyContext";
import { PackagedFile } from "../../business/objects/packagedFile";
import { Station } from "../../business/objects/station";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import { getDroppedOrSelectedFiles } from "./fileSelector";
import LandingZone from "../Machines/LandingZone";
import React from "react";

const fileUploadTextDefault = "Browse or drop directory";

type Props = {
  machine: Machine;
  station: Station;
  currentUser: User;
  openNotificationModal: (
    modalType: string,
    text: string
  ) => IOpenNotificationModal;
};

type State = {
  fileUploadText: string;
  fileUploadHover: boolean;
};

class StationMachine extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      fileUploadText: fileUploadTextDefault,
      fileUploadHover: false,
    };
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidUpdate(prevProps: Props, prevState: State): void {}
  handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const { fileUploadText, fileUploadHover } = this.state;
    if (fileUploadText === "Drop to send a directory" && fileUploadHover)
      return;
    this.setState({
      fileUploadText: "Drop to send a directory",
      fileUploadHover: true
    });
  }
  handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const { fileUploadText, fileUploadHover } = this.state;
    if (fileUploadText === fileUploadTextDefault && !fileUploadHover) return;
    this.setState({
      fileUploadText: fileUploadTextDefault,
      fileUploadHover: false
    });
  }
  async handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Handle drop', e);
    const { machine, station } = this.props;
    this.setState({
      fileUploadText: "Queued..."
    });

    const directoryName = e.dataTransfer.files[0].name;
    let files = await getDroppedOrSelectedFiles(e);
    files = files.map((file: PackagedFile) => {
      const path = file.fullPath.replace(`${directoryName}/`, "");
      return Object.assign({}, file, { fullPath: path.slice(1) });
    });
    let sendJobFunction = async() => {
      const jobUploaded = await this.context.jobService.sendJob(
        machine.mid,
        files,
        directoryName,
        station.id
      );
      this.setState({
        fileUploadText: fileUploadTextDefault,
      });
    }
    this.context.uploadQueue.addToQueue(sendJobFunction);
    this.context.uploadQueue.startQueue();
  }
  handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const { machine, station } = this.props;
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.multiple = true;
    // This feature should be supported but for some reason it isn't.
    // @ts-ignore
    inputElement.webkitdirectory = true;
    inputElement.addEventListener("change", async file => {
      this.setState({
        fileUploadText: "Queued...",
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
      let sendJobFunction = async() => {
        const jobUploaded = await this.context.jobService.sendJob(
          machine.mid,
          formattedFiles,
          directoryName,
          station.id
        );
        this.setState({
          fileUploadText: fileUploadTextDefault,
        });
      }
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
    });
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  render() {
    if (
      this.props.station.invited_list.includes(this.props.currentUser.user_id)
    ) {
      return <LandingZone machine={this.props.machine} station={false} />;
    }

    return (
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
    );
  }
}

type ParentProps = {
  machine: Machine;
};

const mapStateToProps = (store: IStore, ownProps: ParentProps) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modalName: string, text: string) =>
    dispatch(openNotificationModal(modalName, text))
});

StationMachine.contextType = context;
export default connect(mapStateToProps, mapDispatchToProps)(StationMachine);
