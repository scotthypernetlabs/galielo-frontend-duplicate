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
import {Button, Divider, Grid, Typography} from "@material-ui/core";

type Props = {
  currentUser: User;
  openNotificationModal: Function;
  receiveCurrentUserMachines: (machines: Machine[]) => IReceiveCurrentUserMachines;
  currentUserMachines: Machine[];
};

type State = {
}

class Machines extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
  }

  componentDidMount(): void {
    if(this.props.currentUser.user_id !== 'meme'){
      this.context.machineRepository.getMachines(new GetMachinesFilter(null, [this.props.currentUser.user_id]))
      .then((response) => {
        // this.setState({currentUserMachines: response});
        this.props.receiveCurrentUserMachines(response);
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState:State){
    if(prevProps.currentUser.user_id === 'meme' && this.props.currentUser.user_id !== 'meme'){
      this.context.machineRepository.getMachines(new GetMachinesFilter(null, [this.props.currentUser.user_id]))
      .then((response) => {
        // this.setState({currentUserMachines: response});
        this.props.receiveCurrentUserMachines(response);
      });
    }
  }

  public render(){
    const { currentUserMachines } = this.props;

    return(
      <div className="stations-container">
        <Grid
          container={true}
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item={true}>
            <Typography
              variant="h3"
              style={{fontWeight: 500}}
            >
              Machines
            </Typography>
          </Grid>
        </Grid>
        <Divider/>
        <Typography variant="h4" style={{color: 'gray', marginTop: 7}}>My Machines ({currentUserMachines.length})</Typography>
        <Grid container>
          {
            currentUserMachines.map(machine => {
              return(
                  <LandingZone machine={machine} key={machine.mid}/>
              )
            })
          }
        </Grid>
      </div>
    )
  }
}

Machines.contextType = context;

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
  currentUserMachines: state.machines.currentUserMachines,
  // landingZones: state.devices.landingZones
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (text: string) => dispatch(openNotificationModal('Notifications', text)),
  receiveCurrentUserMachines: (machines: Machine[]) => dispatch(receiveCurrentUserMachines(machines))
});


export default connect(mapStateToProps, mapDispatchToProps)(Machines);
