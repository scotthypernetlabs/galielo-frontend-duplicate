import { Box, Grid, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Machine } from "../../business/objects/machine";
import { faSdCard, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../ProgressBar";
import React from "react";
import { connect } from 'react-redux';
import { IStore } from "../../business/objects/store";
import { UploadObjectContainer } from "../../business/objects/job";
import { Dictionary } from "../../business/objects/dictionary";
import { MyContext } from "../../MyContext";
import { context } from "../../context";

type Props = {
  machine: Machine;
  station: boolean;
  fileUploadText?: string;
  stationUploads: Dictionary<UploadObjectContainer>;
  machineUploads: Dictionary<UploadObjectContainer>;
};

type State = {
  identity: string;
};

class LandingZone extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      identity: 'Landing Zone'
    }
  }
  componentDidMount(){
    this.context.uploadQueue.bindComponent(this, this.state.identity);
  }
  componentWillUnmount(){
    this.context.uploadQueue.removeComponent(this.state.identity);
  }
  public render() {
    const { machine, station } = this.props;
    let memory: string = '0 GB';
    let cores: number = 0;
    if (machine.memory !== "Unknown") {
      memory = `${parseInt((parseInt(machine.memory) / 1e9).toFixed(1))} GB`;
    }else{
      memory = "Currently Unavailable";
    }
    if (machine.cpu !== "Unknown") {
      cores = +machine.cpu;
    }
    const iconColor =
      machine.status.toUpperCase() === "ONLINE" ? "rgb(40, 202, 66)" : "red";
    let uploadText = this.props.fileUploadText;
    let machineUploadProgressObject = this.props.machineUploads[machine.mid];
    if(machineUploadProgressObject){
      let queue = this.context.uploadQueue;
      uploadText = `Uploading Job ${queue.totalFinished + 1} of ${queue.totalQueued}`
      let percentage = Math.floor(machineUploadProgressObject.completedUploadSize / machineUploadProgressObject.totalUploadSize * 100)
      if(percentage === 100){
        setTimeout(() => {
          this.forceUpdate();
        }, 2000);
      }
    }
    let showText = false;
    if(this.props.station){
      showText = true;
    }
    return (
      <Box
        border={station ? "2px dashed" : "0.5px solid"}
        borderColor={
          station
            ? machine.status.toUpperCase() === "ONLINE"
              ? "primary.main"
              : "red"
            : "#999"
        }
        borderRadius={5}
        bgcolor="rgb(255, 255, 255, 0.5)"
        p={3}
        m={1}
        minWidth="250px"
        maxWidth="250px"
        minHeight={this.props.station ? "130px" : "100px"}
        maxHeight={this.props.station ? "130px" : "100px"}
        className={this.props.station ? "station-box" : ""}
      >
        <Grid container>
          <Grid item xs={12}>
            <svg
              width="10px"
              height="10px"
              viewBox="0 0 100 100"
              version="1.1"
              style={{ float: "left", margin: "5px 5px 5px 0px" }}
            >
              <ellipse
                id="online-badge"
                fill={iconColor}
                cx="50"
                cy="50"
                rx="40"
                ry="40"
              />
            </svg>
            <Typography
              variant="h4"
              noWrap={true}
              gutterBottom={true}
              style={{ fontWeight: 500 }}
            >
              {machine.machine_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon
              icon={faSdCard}
              color="grey"
              style={{ float: "left", marginRight: 5 }}
            />
            <h5 style={{ color: "grey", fontWeight: 400 }}>{memory}</h5>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon
              icon={faTachometerAlt}
              color="grey"
              style={{ float: "left", marginRight: 5 }}
            />
            <h5 style={{ color: "grey", fontWeight: 400 }}>{cores} Cores</h5>
          </Grid>
          {showText && (
            <div>
              <Grid item xs={12}>
                <h5>{uploadText}</h5>
              </Grid>
            </div>
          )}
          <Grid item xs={12}>
            <ProgressBar type={"machine"} id={machine.mid} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

LandingZone.contextType = context;

const mapStateToProps = (store: IStore) => ({
  stationUploads: store.progress.stationUploads,
  machineUploads: store.progress.machineUploads
});


export default connect(mapStateToProps)(LandingZone);
