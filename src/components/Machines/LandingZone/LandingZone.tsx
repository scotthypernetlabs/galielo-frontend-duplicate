import { Dictionary } from "../../../business/objects/dictionary";
import { IStore } from "../../../business/objects/store";
import { Machine } from "../../../business/objects/machine";
import { MyContext } from "../../../MyContext";
import { UploadObjectContainer } from "../../../business/objects/job";
import { connect } from "react-redux";
import { context } from "../../../context";
import LandingZoneView from "./LandingZoneView";
import React from "react";

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
      identity: "Landing Zone"
    };
    this.updateRunningJobLimit = this.updateRunningJobLimit.bind(this);
  }
  componentDidMount() {
    this.context.uploadQueue.bindComponent(this, this.state.identity);
  }
  componentWillUnmount() {
    this.context.uploadQueue.removeComponent(this.state.identity);
  }
  updateRunningJobLimit(mid: string, runningJobsLimit: number) {
    this.context.machineService.modifyMachineQueueLimit(mid, runningJobsLimit);
  }
  public render() {
    const { machine, station, fileUploadText, machineUploads } = this.props;
    let memory: number = 0;
    let cores: number = 0;
    if (machine.memory !== "Unknown") {
      memory = parseInt((parseInt(machine.memory) / 1e9).toFixed(1));
    }
    if (machine.cpu !== "Unknown") {
      cores = +machine.cpu;
    }
    const memoryText = `${memory}GB`;
    const coresText = `${cores} Cores`;

    let uploadText = fileUploadText;
    const machineUploadProgressObject = machineUploads[machine.mid];
    if (machineUploadProgressObject) {
      const queue = this.context.uploadQueue;
      uploadText = `Uploading Job ${queue.totalFinished + 1} of ${
        queue.totalQueued
      }`;
      const percentage = Math.floor(
        (machineUploadProgressObject.completedUploadSize /
          machineUploadProgressObject.totalUploadSize) *
          100
      );
      if (percentage === 100) {
        setTimeout(() => {
          this.forceUpdate();
        }, 2000);
      }
    }

    return (
      <LandingZoneView
        updateRunningJobLimit = {this.updateRunningJobLimit}
        machineStatus={machine.status.toUpperCase()}
        machineName={machine.machine_name}
        machineId={machine.mid}
        memoryText={memoryText}
        coresText={coresText}
        uploadText={uploadText}
        inStation={station}
        showText={station}
      />
    );
  }
}

LandingZone.contextType = context;

const mapStateToProps = (store: IStore) => ({
  stationUploads: store.progress.stationUploads,
  machineUploads: store.progress.machineUploads
});

export default connect(mapStateToProps)(LandingZone);
