import React, {useEffect} from 'react';
import {Progress} from "antd";
import {IStore} from "../business/objects/store";
import { connect } from 'react-redux';
import {Dispatch} from "redux";
import {deleteProgress, IDeleteProgress} from "../actions/machineActions";
import {Dictionary} from "../business/objects/dictionary";

interface Props {
  uploadProgress: Dictionary<number>;
  progressTracker: number;
  mid: string;
  deleteProgress: (mid: string) => IDeleteProgress
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
    let render = this.props.uploadProgress;
    if(!render){
      return(
        <>
        </>
      )
    }
    const fileNamesUploading = Object.keys(this.props.uploadProgress);
    if(fileNamesUploading.length === 0){
      return(
        <>
        </>
      )
    }
    let doneUploading = this.props.progressTracker;
    let totalToUpload = fileNamesUploading.length;
    const percentage = Math.floor((doneUploading / totalToUpload) * 100);

    if(percentage === 100) {
      setTimeout(() => {
        this.props.deleteProgress(this.props.mid);
      }, 2000);
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
  mid: string;
}

const mapStateToProps = (store: IStore, ownProps: PropsFromParent) => ({
  uploadProgress: store.machines.uploadProgress[ownProps.mid],
  progressTracker: store.machines.progressTracker[ownProps.mid]
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteProgress: (mid: string) => dispatch(deleteProgress(mid))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
