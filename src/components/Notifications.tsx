import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../business/objects/store';
import { Dispatch } from 'redux';
import { Dictionary } from '../business/objects/dictionary';
import { Station } from '../business/objects/station';
import { MyContext } from '../MyContext';
import { context } from '../context';
import {Button, Divider, Grid, Typography} from "@material-ui/core";
import { User } from '../business/objects/user';

type Props = {
  receivedStationInvites: string[];
  stations: Dictionary<Station>;
  users: Dictionary<User>;
}

type State = {

}

class Notifications extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.inboundStationInvites = this.inboundStationInvites.bind(this);
    this.handleStationRequest = this.handleStationRequest.bind(this);
  }
  handleStationRequest(station_id:string, response: boolean){
    return(e:any) => {
      this.context.stationService.respondToStationInvite(station_id, response);
    }
  }
  inboundStationInvites(){
    const { receivedStationInvites, stations, users } = this.props;
    console.log("received", receivedStationInvites);
    if(Object.keys(stations).length === 0){
      return;
    }
    return(
      <>
      {
        receivedStationInvites.map((station_id, idx) => (
          <Grid key={station_id} container={true} alignItems="center">
            {idx > 0 && <Divider style={{color: 'black', marginTop: 0, marginBottom: 20}} />}
            <Grid item={true} xs={8}>
              <Typography variant="h4">
                {
                  (Object.entries(users).length > 0) ?
                  `${users[stations[station_id].owner].username} invited you to join the station ${stations[station_id].name}.` :
                  `You have been invited to join the station ${stations[station_id].name}.`
                }

              </Typography>
            </Grid>
            <Grid item={true} xs={4}>
              <Grid container={true} alignContent="center" justify="flex-end">
                <Grid item>
                  <Button variant="outlined" style={{color: "#009bbb", border: "1px solid #009bbb",}}
                          className="accept-button" onClick={this.handleStationRequest(station_id, true)}>
                    Accept
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" style={{color: "red", border: "1px solid red"}} className="decline-button" onClick={this.handleStationRequest(station_id, false)}>
                    Decline
                  </Button>
                </Grid>
            </Grid>
            </Grid>
          </Grid>
        ))
      }
      </>
    )
  }
  render(){
    const {receivedStationInvites} = this.props;
    console.log(this.props);
    return(
      <div className="notifications">
        <Typography
          variant="h3"
          style={{fontWeight: 500}}
          gutterBottom={true}
        >
          Notifications ({receivedStationInvites.length})
        </Typography>
        { this.inboundStationInvites()}
      </div>
    )
  }
}

Notifications.contextType = context;

const mapStateToProps = (state: IStore) => ({
  receivedStationInvites: state.users.receivedStationInvites,
  stations: state.stations.stations,
  users: state.users.users
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
