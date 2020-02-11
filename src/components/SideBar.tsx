import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IStore } from '../business/objects/store';
import { User } from '../business/objects/user';
import { UserIconNew } from './svgs/UserIconNew';
import { History } from 'history';
import {Drawer, List, ListItem, ListItemText, TextField, withStyles, WithStyles} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBell,
  faDesktop,
  faSignInAlt,
  faSignOutAlt,
  faSitemap,
  faSuitcase,
  faThLarge
} from "@fortawesome/free-solid-svg-icons";
import {createStyles} from "@material-ui/core/styles";


interface Props extends WithStyles<typeof styles>{
  currentUser: User;
  history: History<any>;
  stationInvites: string[];
}

type State = {
  expandStations: boolean,
  editName: boolean,
  currentName: string,
  version: string
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

const styles = () => createStyles({
  noHover: {
    "&:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }
  },
  defaultCursor: {
    cursor: "default",
    "& *": {
      cursor: "default"
    }
  }
});

class SideBar extends React.Component<Props, State> {
  readonly state: State = {
    expandStations: false,
    editName: false,
    currentName: '',
    version: ''
  };
  constructor(props: Props){
    super(props);
    this.changeViews = this.changeViews.bind(this);
    this.editName = this.editName.bind(this);
    this.editNameForm = this.editNameForm.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
  }

  public handleChange(type:keyof State){
    return(e: any) => {
      let value = e.target.value;
      this.setState(updateState(type, value));
    }
  }
  changeViews(view: string){
    return(e:any) => {
      this.props.history.push(`/${view}`);
    }
  }

  public editName(e:any){
    // this.setState({
    //   editName: true,
    //   currentName: this.props.currentUser.username
    // })
  }
  public editNameForm(){
    return(
      <form>
          <TextField
            variant="outlined"
            size="small"
            onChange={this.handleChange('currentName')}
          />
        <div>
          <button onClick={this.handleEditName(true)}>Save</button>
          <button onClick={this.handleEditName(false)}>Discard</button>
        </div>
      </form>
    )
  }

  public handleEditName(saveEdit: boolean){
    return((e:any) => {
      if(saveEdit){
        // code to save edit
      }else{
        this.setState({
          editName: false,
        })
      }
    })
  }

  public render(){
    const {classes} = this.props;
    return(
      <Drawer variant="permanent">
        <List>
          <ListItem
            classes={{
              button: classes.noHover,
              root: classes.defaultCursor
            }}
          >
            {UserIconNew('ONLINE', 40)}
            <ListItemText
              primary={this.state.editName ? this.editNameForm() : this.props.currentUser.username}
              onClick={this.editName}
            />
          </ListItem>
          {/*<ListItem*/}
          {/*  button={true}*/}
          {/*  onClick={this.changeViews('')}*/}
          {/*  selected={this.props.history.location.pathname === '/'}*/}
          {/*>*/}
          {/*  <FontAwesomeIcon icon={faThLarge} />*/}
          {/*  <ListItemText primary="Dashboard" />*/}
          {/*</ListItem>*/}
          <ListItem
            button={true}
            onClick={this.changeViews('stations')}
            selected={this.props.history.location.pathname === '/stations'}
          >
            <FontAwesomeIcon icon={faSitemap} />
            <ListItemText primary="Stations" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews('jobs')}
            selected={this.props.history.location.pathname === '/jobs'}
          >
            <FontAwesomeIcon icon={faSuitcase} />
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews('machines')}
            selected={this.props.history.location.pathname === '/machines'}
          >
            <FontAwesomeIcon icon={faDesktop} />
            <ListItemText primary="Machines" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.changeViews('notifications')}
            selected={this.props.history.location.pathname === '/notifications'}
          >
            <FontAwesomeIcon icon={faBell} />
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem
            button={true}
            onClick={this.props.currentUser.user_id === 'meme' ? this.changeViews('login') : this.changeViews('logout')}
          >
            <FontAwesomeIcon icon={this.props.currentUser.user_id === 'meme' ? faSignInAlt : faSignOutAlt} />
            <ListItemText primary={this.props.currentUser.user_id === 'meme' ? "Login" : "Logout"} />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}
// <button className={`view-results ${marketplace_active}`} onClick={this.changeViews('market')}>
//   <span><i className="fas fa-store"></i>Marketplace</span>
// </button>

const mapStateToProps = (state: IStore) => ({
  currentUser: state.users.currentUser,
  stationInvites: state.users.receivedStationInvites
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(SideBar)));
