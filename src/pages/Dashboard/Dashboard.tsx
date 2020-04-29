import React from 'react';
import { connect } from 'react-redux';
import path from 'path';

const fileUploadTextDefault = 'Browse or drop file';

type Props = {

}

type State = {

}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

  }
  render() {
    return (
      <div className="onboarding-container">
        <h3>Welcome to Galileo!</h3>
        <span>Make a station to get started!</span>
      </div>
    )
  }
}

export default Dashboard;
