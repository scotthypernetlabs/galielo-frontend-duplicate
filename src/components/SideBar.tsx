import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { IStore } from '../business/objects/store';
import { IUser } from '../business/objects/user';
import { UserIconNew } from './svgs/UserIconNew';
import { logService } from './Logger';

type Props = {
  currentUser: IUser;
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
    currentName: 'fuck',
    version: ''
  }
  constructor(props: Props){
    super(props);
    this.changeViews = this.changeViews.bind(this);
    // this.expandStations = this.expandStations.bind(this);
    // this.selectStation = this.selectStation.bind(this);
    // this.createSharedFolder = this.createSharedFolder.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
  }

  componentDidMount(){

  }
  // createSharedFolder(e){
  //   e.preventDefault();
  //   let inputElement = document.createElement('input');
  //   inputElement.type = "file";
  //   inputElement.webkitdirectory = true;
  //   inputElement.addEventListener("change", (file) => {
  //     addSharedFolder(inputElement.files[0].path)
  //       .then((data) => {
  //         this.props.openNotificationModal('Shared Folder Added');
  //       })
  //       .catch((err) => {
  //         this.props.openNotificationModal("Failed to add shared folder");
  //       })
  //   })
  //   inputElement.dispatchEvent(new MouseEvent("click"));
  // }
  // selectStation(station){
  //   return(e) => {
  //     this.props.receiveSelectedGroup(station);
  //     this.props.closeModal();
  //     this.props.history.push('/stations')
  //   }
  // }
  changeViews(view: string){
    return(e:any) => {
      // <Redirect to=`/${view}` />
      // this.props.history.push(`/${view}`);
    }
  }
  // expandStations(e){
  //   e.preventDefault();
  //   e.stopPropagation();
  //   this.setState(prevState => ({
  //     expandStations: !prevState.expandStations
  //   }))
  // }
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

    let dashboard_active = "active";
    let jobs_active;
    let stations_active;
    let shared_folder_active;
    let notifications_active;
    let login_active;
    let intercomComponent;

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
          <Link to="/">
            <button className={`view-results ${dashboard_active}`} onClick={this.changeViews('')}>
              <span><i className="fas fa-store"></i>Marketplace</span>
            </button>
          </Link>
          {
            this.props.currentUser.user_id ?
            <Link to="/logout">
              <button className={`view-results`} onClick={this.changeViews('logout')}>
                <span>Logout</span>
              </button>
            </Link> :
            <Link to="/login">
              <button className={`view-results ${login_active}`} onClick={this.changeViews('login')}>
                <span>Login</span>
              </button>
            </Link>
          }

        </div>
    )
  }
}
const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));
