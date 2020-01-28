import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../business/objects/store';
import { Dispatch } from 'redux';
import { Dictionary } from '../business/objects/dictionary';
import { Station } from '../business/objects/station';
import { MyContext } from '../MyContext';
import { context } from '../context';

type Props = {
  receivedStationInvites: string[];
  stations: Dictionary<Station>;
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
    const { receivedStationInvites, stations } = this.props;
    if(Object.keys(stations).length === 0){
      return;
    }
    return(
      <>
      {
        receivedStationInvites.map((station_id, idx) => (
          <div className="single-notification" key={idx}>
            <div className="notification-body">
              <p>You have been invited to join the group {stations[station_id].name}</p>
              <div className="notification-body-inner">
                <button className="accept-button" onClick={this.handleStationRequest(station_id, true)}>
                  Accept
                </button>
                <button className="decline-button" onClick={this.handleStationRequest(station_id, false)}>
                  Decline
                </button>
              </div>
            </div>
            </div>
        ))
      }
      </>
    )
  }
  render(){
    console.log(this.props);
    return(
      <div className="notifications">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>
      <div className="notifications-container">
        <p className="notifications-type">Invites</p>
        { this.inboundStationInvites()}
      </div>
    </div>
    )
  }
}

Notifications.contextType = context;

const mapStateToProps = (state: IStore) => ({
  receivedStationInvites: state.users.receivedStationInvites,
  stations: state.stations.stations
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
