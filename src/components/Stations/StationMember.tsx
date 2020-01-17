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

type Props = {
  user_id: string;
  users: Dictionary<User>;
  history: History<any>;
}

type State = {

}

class StationMember extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  render(){
    const { user_id } = this.props;
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

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  users: state.users.users
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StationMember);
// {
//   group.admins.includes(this.props.currentUser.owner_id) && !group.admins.includes(user) &&
//   <div className="remove-user">
//     <i className="delete-btn fas fa-trash-alt" onClick={this.handleRemoveUser(user)}></i>
//   </div>
// }
