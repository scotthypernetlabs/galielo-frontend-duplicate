import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { IStore } from '../../business/objects/store';
import { IStation } from '../../business/objects/station';
import { Dictionary } from '../../business/objects/dictionary';

type Props = {
  stations: Dictionary<IStation>;
}

type State = {
}

class Stations extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    if (!this.props.stations) {
      return (
        <>
        </>
      )
    }
    return (
      <div className="stations-container">
        <div className="stations-header">
          <h3>Stations</h3>
          <button className="primary-btn">Add Station</button>
        </div>
        <div className="stations-list">
          {
            Object.keys(this.props.stations).map((station: any) => {
              station = this.props.stations[station];
              if (!station.machines || !station.members || !Object.keys(station.volumes)) {
                return (
                  <>
                  </>
                )
              }
              return (
                <Link to={`/stations/${station.id}`}>
                  <div className="single-station-container" key={station.id}>
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
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
