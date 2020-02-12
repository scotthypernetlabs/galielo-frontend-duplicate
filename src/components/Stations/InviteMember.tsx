import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { User, UserFilterOptions } from '../../business/objects/user';
import { Station } from '../../business/objects/station';
import { UserIconNew } from '../svgs/UserIconNew';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { IReceiveSearchedUsers, receiveSearchedUsers } from '../../actions/userActions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {closeModal, ICloseModal} from "../../actions/modalActions";
import {Button, Grid, TextField, Typography} from "@material-ui/core";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  predictions: User[];
  station: Station;
  currentUser: User;
  receiveSearchedUsers: (user_list: User[]) => IReceiveSearchedUsers;
  closeModal: () => ICloseModal;
}

type State = {
  searchInput: string;
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
})

class InviteMembers extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      searchInput: ''
    }
    this.removeUserFromStation = this.removeUserFromStation.bind(this);
    this.inviteUserToCurrentStation = this.inviteUserToCurrentStation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displayPredictions = this.displayPredictions.bind(this);
  }
  public removeUserFromStation(user_id: string){
    return(e:any) => {
      this.context.stationService.expelUser(this.props.station.id, user_id);
    }
  }
  public inviteUserToCurrentStation(user_id: string){
    return(e:any) => {
      this.context.stationService.inviteUsersToStation(this.props.station.id, [user_id]);
    }
  }
  public handleChange(type:keyof State){
    return(e:React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      this.setState(updateState(type, value));
      if(value.length > 1){
        this.context.userService.searchByUsername(new UserFilterOptions(null, value));
      }else{
        this.props.receiveSearchedUsers([]);
      }
    }
  }
  public displayPredictions(){
    const { predictions, station } = this.props;
    return(
      <div className="predictions">
      {
        predictions.map((prediction, idx) => {
          let inStationAlready = station.members.indexOf(prediction.user_id) >= 0;
          let alreadyInvited = false;
          if(station.invited_list.indexOf(prediction.user_id) >= 0){
            alreadyInvited = true;
          }
          if(prediction.user_id === this.props.currentUser.user_id){
            return;
          }
          return(
            <div key={`${prediction.user_id}${idx}`} className="prediction">
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      {UserIconNew('ONLINE', 40)}
                    </Grid>
                    <Grid item>
                      <div style={{margin: 5}}>
                        {prediction.username}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  {
                    inStationAlready &&
                    station.admins.indexOf(this.props.currentUser.user_id) >= 0 &&
                    <Button variant="outlined" color="primary" onClick={this.removeUserFromStation(prediction.user_id)}>
                      Remove
                    </Button>
                  }
                  {
                      alreadyInvited && <div>Invited</div>
                  }
                  {
                    !inStationAlready && !alreadyInvited &&
                    <Button variant="outlined" color="primary" onClick={this.inviteUserToCurrentStation(prediction.user_id)}>
                      Invite
                    </Button>
                  }
                </Grid>
              </Grid>
            </div>
          )
        })
      }
      </div>
    )
  }
  render(){
    return(
      <div className="modal-style" onClick={(e:any) => e.stopPropagation()}>
        <div className="invite-members">
          <div className="group-machine-modal-title">
            <Typography variant="h3" gutterBottom={true}>Add Users</Typography>
            <div onClick={this.props.closeModal} className="add-cursor"><i className="fal fa-times"/></div>
          </div>
          <button className="user-search">
            <TextField
              variant="outlined"
              size="small"
              type="text"
              value={this.state.searchInput}
              onChange={this.handleChange("searchInput")}
              placeholder={"Search by Email"}
              />
          </button>
          {this.displayPredictions()}
        </div>
      </div>
    )
  }
}

InviteMembers.contextType = context;

type InjectedProps = {
  match: any,
  history: any
}

const mapStateToProps = (store: IStore, ownProps: InjectedProps) => {
  return({
    predictions: store.users.searchedUsers,
    currentUser: store.users.currentUser,
    stations: store.stations.stations,
    station: store.stations.selectedStation
  })
};

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveSearchedUsers: (user_list: User[]) => dispatch(receiveSearchedUsers(user_list)),
  closeModal: () => dispatch(closeModal())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InviteMembers));
