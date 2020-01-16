import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Link } from 'react-router-dom';
import { Station } from '../../business/objects/station';
import { Dictionary } from '../../business/objects/dictionary';
import { openModal, IOpenModal } from '../../actions/modalActions';
import { MyContext } from '../../MyContext';
import { context } from '../../context';

type Props = {
  stations: Dictionary<Station>;
  openCreateStation: () => IOpenModal;
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
          Object.keys(this.props.stations).map( (station:any, idx:number) => {
            station = this.props.stations[station];
            if(!station.machines || !station.members || !Object.keys(station.volumes)){
              return (
                <React.Fragment key={idx}>
                </React.Fragment>
              )
            }
            return(
            <Link to={`/stations/${station.id}`} key={station.id} className="single-station-container">
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
            </Link>
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
  openCreateStation: () => dispatch(openModal('Create Station'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
