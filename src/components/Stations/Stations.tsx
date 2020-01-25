import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Station } from '../../business/objects/station';
import { Dictionary } from '../../business/objects/dictionary';
import { openModal, IOpenModal } from '../../actions/modalActions';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { IReceiveSelectedStation, receiveSelectedStation } from '../../actions/stationActions';

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}

type State = {
}

class Stations extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
  }
  componentDidMount(){
    this.context.stationService.refreshStations();
  }
  handleOpenStation(station: Station){
    return(e:any) => {
      this.props.history.push(`/stations/${station.id}`)
      this.props.receiveSelectedStation(station);
    }
  }
  render(){
    if(!this.props.stations){
      return(
        <>
        </>
      )
    }
    return(
      <div className="stations-container">
        <div className="stations-header">
          <h3>Stations</h3>
          <button className="primary-btn" onClick={this.props.openCreateStation}>Add Station</button>
        </div>
        <div className="stations-list">
        {
          Object.keys(this.props.stations).map( (station_id:string, idx:number) => {
            let station:Station = this.props.stations[station_id];
            if(!station.machines || !station.members || !Object.keys(station.volumes)){
              return (
                <React.Fragment key={idx}>
                </React.Fragment>
              )
            }
            return(
            <div onClick={this.handleOpenStation(station)} key={station.id} className="single-station-container">
                <div className="station-name">
                  {station.name}
                </div>
                <div className="station-details">
                <span>
                  <i className="fas fa-chalkboard"></i>{`\u00A0${station.machines.length}`}
                </span>
                <span>
                  <i className="fas fa-user"></i>{`\u00A0${station.members.length}`}
                </span>
                <span>
                  <i className="fas fa-database"></i>{`\u00A0${Object.keys(station.volumes).length}`}
                </span>
                </div>
            </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}

Stations.contextType = context;

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openCreateStation: () => dispatch(openModal('Create Station')),
  receiveSelectedStation: (station: Station) => dispatch(receiveSelectedStation(station))
})

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
