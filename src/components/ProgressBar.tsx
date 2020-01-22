import React from 'react';
import {Progress} from "antd";
import {IStore} from "../business/objects/store";
import { connect } from 'react-redux';
import {Dispatch} from "redux";
import {deleteProgress, IDeleteProgress} from "../actions/machineActions";

interface Props {
  progress: number;
  mid: string;
  deleteProgress: (mid: string) => IDeleteProgress
}
type State = {}

class ProgressBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    if(this.props.progress === 100) {
      this.props.deleteProgress(this.props.mid);
    }

    return(
      <Progress
        strokeColor='#4dc1ab'
        percent={this.props.progress}
      />
    )
  }
}

type InjectedProps = {
  mid: string;
}

const mapStateToProps = (store: IStore, ownProps: InjectedProps) => ({
    progress: store.machines.uploadProgress[ownProps.mid]
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteProgress: (mid: string) => dispatch(deleteProgress(mid))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
