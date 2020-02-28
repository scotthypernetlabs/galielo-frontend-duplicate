import { Dictionary } from "../business/objects/dictionary";
import { Dispatch } from "redux";
import {
  IDeleteMachineProgress,
  IDeleteStationProgress,
  deleteMachineProgress,
  deleteStationProgress
} from "../actions/progressActions";
import { IStore } from "../business/objects/store";
import { Progress } from "antd";
import { UploadObjectContainer } from "../business/objects/job";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { MyContext } from "../MyContext";
import { context } from "../context";
import { Typography } from "@material-ui/core";

interface Props {
  type: string;
  id: string;
  deleteMachineProgress: (mid: string) => IDeleteMachineProgress;
  deleteStationProgress: (station_id: string) => IDeleteStationProgress;
  stationUploads: Dictionary<UploadObjectContainer>;
  machineUploads: Dictionary<UploadObjectContainer>;
}
type State = {
  identity: string;
};

class ProgressBar extends React.Component<Props, State> {
  // id created by setTimeout
  timeout: NodeJS.Timeout;
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      identity: 'Progress Bar'
    }
  }
  componentDidMount() {
    this.context.uploadQueue.bindComponent(this, this.state.identity);
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
    this.context.uploadQueue.removeComponent(this.state.identity);
  }
  render() {
    let percentage = 0;
    let render = false;
    let stationUploadProgressObject = null;
    let machineUploadProgressObject = null;
    if (this.props.type === "station") {
      stationUploadProgressObject = this.props.stationUploads[this.props.id];
      if (stationUploadProgressObject) {
        render = true;
        percentage = Math.floor(
          (stationUploadProgressObject.completedUploadSize /
            stationUploadProgressObject.totalUploadSize) *
            100
        );
        if (percentage === 100) {
          this.timeout = setTimeout(() => {
            this.props.deleteStationProgress(this.props.id);
            this.forceUpdate();
          }, 2000);
        }
      }
    } else if (this.props.type === "machine") {
      machineUploadProgressObject = this.props.machineUploads[this.props.id];
      if (machineUploadProgressObject) {
        render = true;
        percentage = Math.floor(
          (machineUploadProgressObject.completedUploadSize /
            machineUploadProgressObject.totalUploadSize) *
            100
        );
        if (percentage === 100) {
          this.props.deleteMachineProgress(this.props.id);
          this.timeout = setTimeout(() => {
            this.forceUpdate();
          }, 2000);
        }
      }
    }
    return render && <Progress strokeColor="#4dc1ab" percent={percentage} />
  }
}

ProgressBar.contextType = context;

type PropsFromParent = {
  type: string;
  id: string;
};

const mapStateToProps = (store: IStore, ownProps: PropsFromParent) => ({
  stationUploads: store.progress.stationUploads,
  machineUploads: store.progress.machineUploads
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteMachineProgress: (mid: string) => dispatch(deleteMachineProgress(mid)),
  deleteStationProgress: (station_id: string) =>
    dispatch(deleteStationProgress(station_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
