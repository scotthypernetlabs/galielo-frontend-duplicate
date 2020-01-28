import React from 'react';
import { UserIconNew } from '../svgs/UserIconNew';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { IStore } from '../../business/objects/store';
import { Machine } from '../../business/objects/machine';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { Dispatch } from 'redux';
import { Dictionary } from '../../business/objects/dictionary';
import { User } from '../../business/objects/user';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { Station } from '../../business/objects/station';

type Props = {
  station: Station;
  user_id: string;
  users: Dictionary<User>;
  history: History<any>;
  currentUser: User;
}

type State = {

}

class StationMember extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
  }
  handleRemoveUser(station_id: string, user_id: string){
    return(e:any) => {
      this.context.stationService.expelUser(station_id, user_id);
    }
  }
  render(){
    const { user_id, station } = this.props;
    console.log(this.props);
    const user = this.props.users[user_id];
    return(
      <div className="station-member">
        <div className='member-icon'>
          {UserIconNew('OFFLINE', 35)}
        </div>
        <div className="member-details">
          <div className="member-name">
          </div>
          <div className="member-email">
          {user.username}
          </div>
          {
          station.admins.indexOf(this.props.currentUser.user_id) >= 0 && station.admins.indexOf(user_id) < 0 &&
            <div className="remove-user">
              <i className="delete-btn fas fa-trash-alt" onClick={this.handleRemoveUser(station.id, user_id)}></i>
            </div>
          }
        </div>
      </div>
    )
  }
}

StationMember.contextType = context;

const mapStateToProps = (state: IStore) => ({
  users: state.users.users,
  currentUser: state.users.currentUser
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StationMember);
