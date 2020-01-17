import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { User } from '../../business/objects/user';
import { Station } from '../../business/objects/station';
import { UserIconNew } from '../svgs/UserIconNew';
import { MyContext } from '../../MyContext';
import { context } from '../../context';

type Props = {
  predictions: User[];
  station: Station;
  currentUser: User;
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
          return(
            <div key={`${prediction.user_id}${idx}`} className="prediction">
              {UserIconNew('OFFLINE', 30)}
              <div className="prediction-name">{prediction}</div>
              <div className="member-invite-button">
              {
                inStationAlready &&
                station.admins.indexOf(this.props.currentUser.user_id) &&
                <button className="secondary-btn" onClick={this.removeUserFromStation(prediction.user_id)}>
                  Remove
                </button>
              }
              {
                  alreadyInvited && 'Invited'
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
      <div className="invite-members">
          <h4 className="add-users">Add Users</h4>
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
    )
  }
}

InviteMembers.contextType = context;

const mapStateToProps = (store: IStore) => ({
  predictions: store.users.users,
  currentUser: store.users.currentUser
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(InviteMembers);
