import React, {useEffect} from 'react';
import {Progress} from "antd";
import {IStore} from "../business/objects/store";
import { connect } from 'react-redux';
import {Dispatch} from "redux";
import {deleteProgress, IDeleteProgress} from "../actions/machineActions";
import {Dictionary} from "../business/objects/dictionary";

interface Props {
  progress: Dictionary<number>;
  mid: string;
  deleteProgress: (mid: string) => IDeleteProgress
}
type State = {}

class ProgressBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const percentage = this.props.progress[this.props.mid];
    const render = this.props.mid in this.props.progress;

    if(percentage === 100) {
      setTimeout(() => {
        this.props.deleteProgress(this.props.mid);
        this.forceUpdate();
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

const mapStateToProps = (store: IStore) => ({
  progress: store.machines.uploadProgress
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteProgress: (mid: string) => dispatch(deleteProgress(mid))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
