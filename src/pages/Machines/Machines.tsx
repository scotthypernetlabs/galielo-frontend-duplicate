import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { IUser } from '../../business/objects/user';
import { IMachine } from '../../business/objects/machine';
import { openNotificationModal } from '../../actions/modalActions';
import LandingZone from '../../components/Machines/LandingZone';

type Props = {
  currentUser: IUser;
  openNotificationModal: Function;
};

type State = {

}

class Machines extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.addMachine = this.addMachine.bind(this);
  }
  public addMachine(e: any) {
    e.preventDefault();
    this.props.openNotificationModal('This feature will be added in the future!');
  }
  public render() {
    const currentUserMachines: IMachine[] = [];
    return (
      <div className="stations-container">
        <div className="stations-header">
          <h3>Machines</h3>
          <button className="primary-btn" onClick={this.addMachine}>Add Machine</button>
        </div>
        <div className="section-header station-machines-header">
          <span>My Machines ({currentUserMachines.length})</span>
        </div>
        <div className="station-machines">
          {
            currentUserMachines.map(machine => {
              return (
                <div className="machine-in-station" key={machine.mid}>
                  <LandingZone machine={machine} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser
  // currentUserMachines: state.devices.currentUserMachines,
  // landingZones: state.devices.landingZones
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Notifications', text))
})


export default connect(mapStateToProps, mapDispatchToProps)(Machines);
