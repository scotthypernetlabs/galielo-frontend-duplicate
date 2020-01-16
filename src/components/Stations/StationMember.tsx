import React from 'react';
import { UserIconNew } from '../svgs/UserIconNew';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { IStore } from '../../business/objects/store';
import { Machine } from '../../business/objects/machine';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

type Props = {
  user: any;
  history: History<any>;
}

type State = {

}

class StationMember extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  render(){
    const { user } = this.props;
    const match = matchPath(this.props.history.location.pathname, {
      path: '/stations/:id',
      exact: true,
      strict: false
    });
    // @ts-ignore
    const group = this.props.groups[match.params.id];
    return(
      <div className="station-member">
        <div className='member-icon'>
          {UserIconNew(user.status, 35)}
        </div>
        <div className="member-details">
          <div className="member-name">
          </div>
          <div className="member-email">
          {user}
          </div>

        </div>
      </div>
    )
  }
}

export default StationMember;
// {
//   group.admins.includes(this.props.currentUser.owner_id) && !group.admins.includes(user) &&
//   <div className="remove-user">
//     <i className="delete-btn fas fa-trash-alt" onClick={this.handleRemoveUser(user)}></i>
//   </div>
// }
