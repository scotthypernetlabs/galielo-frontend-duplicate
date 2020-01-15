import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { IStore } from '../business/objects/store';
import { IUser } from '../business/objects/user';
import { UserIconNew } from './svgs/UserIconNew';
import { logService } from './Logger';
import { History } from 'history';

type Props = {
  currentUser: IUser;
  history: History<any>;
};
type State = {
  expandStations: boolean,
  editName: boolean,
  currentName: string,
  version: string
}

class SideBar extends React.Component<Props, State> {
  readonly state: State = {
    expandStations: false,
    editName: false,
    currentName: '',
    version: ''
  }
  constructor(props: Props){
    super(props);
    this.changeViews = this.changeViews.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
  }

  componentDidMount(){

  }
  changeViews(view: string){
    return(e:any) => {
      this.props.history.push(`/${view}`);
    }
  }

  public editName(e:any){
    // this.setState({
    //   editName: true,
    //   currentName: this.props.currentUser.name
    // })
  }
  public editNameForm(){
    // return(
    //   <textarea
    //     value={this.state.currentName}
    //     onChange={this.handleChange('currentName')}
    //     className="change-name-input"
    //     onKeyPress={this.handleInputKeyPress}
    //     />
    // )
  }

  public render(){
    let jobsClass = "view-results";
    let stationsClass = "view-results";
    let notificationsClass = "view-results";

    switch(this.props.history.location.pathname){
      case '/stations':
        stationsClass += "-selected";
        break;
      case '/notifications':
        notificationsClass += "-selected";
        break;
      case '/jobs':
        jobsClass += "-selected";
        break;
      default:
        if(this.props.history.location.pathname.includes('/stations')){
          stationsClass += "-selected";
        }
        break;
    }

    let dashboard_active;
    let jobs_active;
    let stations_active;
    let notifications_active;
    let machines_active;
    let marketplace_active;
    switch(this.props.history.location.pathname){
      case '/':
        dashboard_active = "active";
        break;
      case '/jobs':
        jobs_active = "active";
        break;
      case '/stations':
        stations_active = "active";
        break;
      case '/notifications':
        notifications_active = "active";
        break;
      case '/machines':
        machines_active = "active";
        break;
      case '/marketplace':
        marketplace_active = "active";
        break;
    }

    logService.log("Props in SideBar", this.props);
    return(
        <div className="groups">
          <div className="groups-header">
              <div className="group-user-icon" onClick={this.changeViews('')}>
              {
                UserIconNew('ONLINE', 40)
              }
              </div>
              <div className="user-info-holder">
                <div>
                {this.props.currentUser.username}
                </div>
              </div>
          </div>
          <button className={`view-results ${dashboard_active}`} onClick={this.changeViews('')}>
            <span><i className="fas fa-th-large"></i>Dashboard</span>
          </button>
          <button className={`view-results ${jobs_active}`} onClick={this.changeViews('jobs')}>
            <span><i className="fas fa-suitcase"></i>Jobs</span>
          </button>
          <button className={`view-results ${stations_active}`} onClick={this.changeViews('stations')}>
            <span><i className="fas fa-sitemap"></i>Stations</span>
          </button>
          <button className={`view-results ${machines_active}`} onClick={this.changeViews('machines')}>
            <span><i className="fas fa-desktop"></i>Machines</span>
          </button>
          {
            this.props.currentUser.user_id ?
              <button className={`view-results`} onClick={this.changeViews('logout')}>
                <span>Logout</span>
              </button>
            :
            <button className={`view-results`} onClick={this.changeViews('login')}>
              <span>Login</span>
            </button>
          }

        </div>
    )
  }
}
// <button className={`view-results ${marketplace_active}`} onClick={this.changeViews('market')}>
//   <span><i className="fas fa-store"></i>Marketplace</span>
// </button>
const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));
