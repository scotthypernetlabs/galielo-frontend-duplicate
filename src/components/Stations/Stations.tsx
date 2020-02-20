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
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChalkboard, faDatabase, faUser} from "@fortawesome/free-solid-svg-icons";
import { IReceiveSelectedStation, receiveSelectedStation } from '../../actions/stationActions';
import {User} from "../../business/objects/user";
import { linkYellow } from '../theme';
import StationBox from './StationBox';

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  currentUser: User;
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
      console.log("event here",e);
      console.log("props", this.props);
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

    let pendingStations: Station[] = [];
    let stations: Station[] = [];
    Object.keys(this.props.stations).map( (station_id: string) => {
      let station: Station = this.props.stations[station_id];
      if ( station.invited_list.includes(this.props.currentUser.user_id) ){
        pendingStations.push(station)
      } else {
        stations.push(station)
      }
    });

    return(
      <div className="stations-container">
        {Object.keys(this.props.stations).length > 0 ?
            <div>
              <Grid
                  container
                  justify="space-between"
                  alignItems="baseline"
              >
                  <Grid item>
                      <Typography
                          variant="h3"
                          style={{fontWeight: 500}}
                      >
                          Stations
                      </Typography>
                  </Grid>
                  <Grid item>
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={this.props.openCreateStation}>
                          Add Station
                      </Button>
                  </Grid>
              </Grid>
              <Grid container>
              {
                stations.map( (station: Station, idx: number) => {
                  if(!station.machines || !station.members || !Object.keys(station.volumes)){
                    return (
                      <React.Fragment key={`station-${idx}`}>
                      </React.Fragment>
                    )
                  }
                  return(
                    <StationBox
                      key={`station-${idx}`}
                      handleOpenStation={(station: Station) => this.handleOpenStation(station)}
                      pending={false}
                      station={station}
                    />
                  )
                })
              }
              <Grid container style={{paddingTop: 50}}>
                  <Grid item>
                      <Typography>
                          Pending Invitations ({pendingStations.length})
                      </Typography>
                  </Grid>
                  <Grid container={true}>
                    {
                      pendingStations.map((station: Station, idx: number) => {
                        if (!station.machines || !station.members || !Object.keys(station.volumes)) {
                          return (
                            <React.Fragment key={`pending-station-${idx}`}>
                            </React.Fragment>
                          )
                        }
                        return (
                          <StationBox
                            key={`pending-station-${idx}`}
                            handleOpenStation={(station: Station) => this.handleOpenStation(station)}
                            pending={true}
                            station={station}
                          />
                        )
                      })
                    }
                  </Grid>
              </Grid>
            </Grid>
          </div> :
          <Grid container direction="column" alignItems="center" justify="center" spacing={2} style={{minHeight: 400}}>
            <Grid item>
              <Typography variant="h1" style={{fontWeight: 700}}>
                Welcome to Galileo!
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Make a station to get started!
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.openCreateStation}>
                Add Station
              </Button>
            </Grid>
          </Grid>
        }

      </div>
    )
  }
}

Stations.contextType = context;

const mapStateToProps = (state: IStore) => ({
  stations: state.stations.stations,
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openCreateStation: () => dispatch(openModal('Create Station')),
  receiveSelectedStation: (station: Station) => dispatch(receiveSelectedStation(station)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stations);
