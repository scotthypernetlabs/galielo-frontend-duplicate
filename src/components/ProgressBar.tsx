import React, {useEffect} from 'react';
import {Progress} from "antd";
import {IStore} from "../business/objects/store";
import { connect } from 'react-redux';
import {Dispatch} from "redux";
import {Dictionary} from "../business/objects/dictionary";
import { deleteMachineProgress, IDeleteMachineProgress, deleteStationProgress, IDeleteStationProgress } from '../actions/progressActions';
import { UploadObjectContainer } from '../business/objects/job';

interface Props {
  type: string;
  id: string;
  deleteMachineProgress: (mid: string) => IDeleteMachineProgress;
  deleteStationProgress: (station_id: string) => IDeleteStationProgress;
  stationUploads: Dictionary<UploadObjectContainer>;
  machineUploads: Dictionary<UploadObjectContainer>;
}
type State = {
}

class ProgressBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  componentDidMount(){

  }
  render() {
    let percentage = 0;
    let render = false;
    let stationUploadProgressObject = null;
    let machineUploadProgressObject = null;
    if(this.props.type === 'station'){
      stationUploadProgressObject = this.props.stationUploads[this.props.id];
      if(stationUploadProgressObject){
        render = true;
        percentage = Math.floor(stationUploadProgressObject.completedUploadSize / stationUploadProgressObject.totalUploadSize * 100);
        if(percentage === 100){
          setTimeout(() => {
            this.props.deleteStationProgress(this.props.id);
            this.forceUpdate();
          }, 2000)
        }
      }
    }else if(this.props.type === 'machine'){
      machineUploadProgressObject = this.props.machineUploads[this.props.id];
      if(machineUploadProgressObject){
        render = true;
        percentage = Math.floor(machineUploadProgressObject.completedUploadSize / machineUploadProgressObject.totalUploadSize * 100);
        if(percentage === 100){
          setTimeout(() => {
            this.props.deleteMachineProgress(this.props.id);
            this.forceUpdate();
          }, 2000)
        }
      }
    }
    return(
      render && <Progress
          strokeColor='#4dc1ab'
          percent={percentage}
      />
    )
  }
}

type PropsFromParent = {
  type: string;
  id: string;
}

const mapStateToProps = (store: IStore, ownProps: PropsFromParent) => ({
  stationUploads: store.progress.stationUploads,
  machineUploads: store.progress.machineUploads
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteMachineProgress: (mid: string) => dispatch(deleteMachineProgress(mid)),
  deleteStationProgress: (station_id: string) => dispatch(deleteStationProgress(station_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
