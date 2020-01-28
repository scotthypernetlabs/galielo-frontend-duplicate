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
              {UserIconNew('OFFLINE', 30)}
              <div className="prediction-name">{prediction.username}</div>
              <div className="member-invite-button">
              {
                inStationAlready &&
                station.admins.indexOf(this.props.currentUser.user_id) >= 0 &&
                <button className="secondary-btn" onClick={this.removeUserFromStation(prediction.user_id)}>
                  Remove
                </button>
              }
              {
                  alreadyInvited && <div>Invited</div>
              }
              {
                !inStationAlready && !alreadyInvited &&
                <button className="secondary-btn" onClick={this.inviteUserToCurrentStation(prediction.user_id)}>
                  Invite
                </button>
              }
              </div>
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
            <span>Add Users</span>
            <div onClick={this.props.closeModal}><i className="fal fa-times"/></div>
          </div>
          <button className="user-search">
            <div className="user-search-inner">
              <input
                className="user-search-input"
                type="text"
                value={this.state.searchInput}
                onChange={this.handleChange("searchInput")}
                placeholder={"Search by Email"}
                />
            </div>
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
  if(!store.stations.stations[ownProps.match.params.id]) {
    return({
      predictions: store.users.searchedUsers,
      currentUser: store.users.currentUser,
      stations: store.stations.stations,
      station: {}
    })
  }

  return({
    predictions: store.users.searchedUsers,
    currentUser: store.users.currentUser,
    stations: store.stations.stations,
    station: store.stations.stations[ownProps.match.params.id]
  })
};

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveSearchedUsers: (user_list: User[]) => dispatch(receiveSearchedUsers(user_list)),
  closeModal: () => dispatch(closeModal())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InviteMembers));
