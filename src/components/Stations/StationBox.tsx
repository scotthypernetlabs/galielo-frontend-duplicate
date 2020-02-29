import { Box, Button, Grid, Typography } from "@material-ui/core";
import { Dispatch } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IReceiveSelectedStation,
  receiveSelectedStation
} from "../../actions/stationActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { PackagedFile } from "../../business/objects/packagedFile";
import { Station } from "../../business/objects/station";
import { User } from "../../business/objects/user";
import { connect } from "react-redux";
import { context } from "../../context";
import {
  faChalkboard,
  faDatabase,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { getDroppedOrSelectedFiles } from "./fileSelector";
import { linkYellow } from "../theme";
import ProgressBar from "../ProgressBar";
import React from "react";

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
      identity: 'Station Box'
    };
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.stationDetails = this.stationDetails.bind(this);
    this.handleRunJobClick = this.handleRunJobClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  componentDidMount(){
    this.context.uploadQueue.bindComponent(this, this.state.identity);
  }
  componentWillUnmount(){
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
    return (e: any) => {
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
    let sendJobFunction = async() => {
      const jobUploaded = await this.context.jobService.sendStationJob(
        station.id,
        files,
        directoryName
      );
      this.setState({
        fileUploadText: "Queued...",
        disabled: false,
        fileUpload: false
      });
    }
    this.context.uploadQueue.addToQueue(sendJobFunction);
    this.context.uploadQueue.startQueue();
  }

  stationDetails(station: Station) {
    if (this.state.fileUpload || this.state.dragOver) {
      return (
        <Grid item xs={12}>
          <h5>{this.state.fileUploadText}</h5>
        </Grid>
      );
    }
    return (
      <>
        <Grid item={true} xs={4}>
          <FontAwesomeIcon
            icon={faChalkboard}
            style={{ color: "black", float: "left", marginRight: 5 }}
          />
          <Typography variant="h5">{station.machines.length}</Typography>
        </Grid>
        <Grid item={true} xs={4}>
          <FontAwesomeIcon
            icon={faUser}
            style={{ color: "black", float: "left", marginRight: 5 }}
          />
          <Typography variant="h5">{station.members.length}</Typography>
        </Grid>
        <Grid item={true} xs={4}>
          <FontAwesomeIcon
            icon={faDatabase}
            style={{ color: "black", float: "left", marginRight: 5 }}
          />
          <Typography variant="h5">
            {Object.keys(station.volumes).length}
          </Typography>
        </Grid>
      </>
    );
  }

  handleRunJobClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    const { station } = this.props;
    if (disabled) return;
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    // @ts-ignore
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
      let sendJobFunction = async() => {
        const jobUploaded = await this.context.jobService.sendStationJob(
          station.id,
          formattedFiles,
          directoryName
        );
        this.setState({
          fileUploadText: "Queued...",
          disabled: false
        });
      }
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
    });
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  stationHoverView(station: Station) {
    let className = "station-hover-grid";
    if (!this.state.hover) {
      className += " hidden";
    }

    return (
      <Grid container className={className}>
        <Grid className="station-hover-button-container">
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={this.handleOpenStation(station)}
          >
            View Station
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={this.handleRunJobClick}
          >
            Run Job
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { station, pending } = this.props;
    return (
      <div
        onClick={this.handleOpenStation(station)}
        key={station.id}
        onDragOver={this.handleDragOver}
        onDrop={e => this.handleDrop(e, station)}
      >
        <Box
          onMouseEnter={this.handleMouseOver}
          onMouseLeave={this.handleMouseOut}
          border={1}
          borderColor="#cccccc"
          p={3}
          m={1}
          minWidth="250px"
          maxWidth="250px"
          minHeight="120px"
          maxHeight="120px"
          bgcolor="rgb(255, 255, 255, 0.5)"
          className="station-box"
        >
          <Grid container>
            <Grid item xs={12}>
              {pending ? (
                <Typography
                  gutterBottom
                  variant="h3"
                  style={{ color: linkYellow.main }}
                >
                  {station.name}
                </Typography>
              ) : (
                <Typography gutterBottom variant="h3" color="primary">
                  {station.name}
                </Typography>
              )}
            </Grid>
            {!pending && this.stationHoverView(station)}
            <Grid item xs={4}>
              <FontAwesomeIcon
                icon={faChalkboard}
                style={{ color: "black", float: "left", marginRight: 5 }}
              />
              <Typography variant="h5">{station.machines.length}</Typography>
            </Grid>
            <Grid item xs={4}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "black", float: "left", marginRight: 5 }}
              />
              <Typography variant="h5">{station.members.length}</Typography>
            </Grid>
            <Grid item xs={4}>
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ color: "black", float: "left", marginRight: 5 }}
              />
              <Typography variant="h5">
                {Object.keys(station.volumes).length}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ProgressBar type={"station"} id={station.id} />
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}

StationBox.contextType = context;

const mapStatetoProps = (state: IStore) => ({
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSelectedStation: (station: Station) =>
    dispatch(receiveSelectedStation(station))
});

export default connect(mapStatetoProps, mapDispatchToProps)(StationBox);
