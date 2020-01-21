import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { User } from '../../business/objects/user';
import { Machine, GetMachinesFilter } from '../../business/objects/machine';
import { openNotificationModal } from '../../actions/modalActions';
import LandingZone from './LandingZone';
import {MyContext} from "../../MyContext";
import {context} from "../../context";
import {MachineRepository} from "../../data/implementations/machineRepository";
import { IReceiveCurrentUserMachines, receiveCurrentUserMachines } from '../../actions/machineActions';

type Props = {
  currentUser: User;
  openNotificationModal: Function;
  receiveCurrentUserMachines: (machines: Machine[]) => IReceiveCurrentUserMachines
};

type State = {
  currentUserMachines: Machine[];
}

class Machines extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      currentUserMachines: undefined
    };
    this.addMachine = this.addMachine.bind(this);
  }

  componentDidMount(): void {
    this.context.machineRepository.getMachines(new GetMachinesFilter(null, [this.props.currentUser.user_id]))
      .then((response) => {
        this.setState({currentUserMachines: response});
        // this.props.receiveCurrentUserMachines(response);
      });
  }

  public addMachine(e:any){
    e.preventDefault();
    this.props.openNotificationModal('This feature will be added in the future!');
  }
  public render(){
    if(!this.state.currentUserMachines) {
      return <div/>
    }
    const { currentUserMachines } = this.state;

    return(
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
              return(
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

Machines.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser
  // currentUserMachines: state.devices.currentUserMachines,
  // landingZones: state.devices.landingZones
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Notifications', text)),
  receiveCurrentUserMachines: (machines: Machine[]) => dispatch(receiveCurrentUserMachines(machines))
});


export default connect(mapStateToProps, mapDispatchToProps)(Machines);
