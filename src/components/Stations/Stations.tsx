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
        <Grid
          container={true}
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item={true}>
            <Typography
              variant="h3"
              style={{fontWeight: 500}}
            >
              Stations
            </Typography>
          </Grid>
          <Grid item={true}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.props.openCreateStation}>
              Add Station
            </Button>
          </Grid>
        </Grid>
        <Grid container={true}>
          {
            Object.keys(this.props.stations).length > 0 ?
            Object.keys(this.props.stations).map( (station_id: string, idx:number) => {
              let station: Station = this.props.stations[station_id];
              if(!station.machines || !station.members || !Object.keys(station.volumes)){
                return (
                  <React.Fragment key={idx}>
                  </React.Fragment>
                )
              }
              return(
                  <div onClick={this.handleOpenStation(station)} key={station.id}>
                    <Box
                      border={1}
                      borderColor="#cccccc"
                      p={3}
                      m={1}
                      minWidth="250px"
                      maxWidth="250px"
                      minHeight="120px"
                      maxHeight="120px"
                      bgcolor="rgb(255, 255, 255, 0.5)"
                      className="station-box"
                    >
                      <Grid container>
                        <Grid item={true} xs={12}>
                          {station.invited_list.includes(this.props.currentUser.user_id) ?
                            <Typography gutterBottom={true} variant="h3" style={{color: linkYellow.main}}>{station.name}</Typography> :
                            <Typography gutterBottom={true} variant="h3" color="primary">{station.name}</Typography>
                          }
                        </Grid>
                        <Grid item={true} xs={4}>
                          <FontAwesomeIcon icon={faChalkboard} style={{color: "black", float: 'left', marginRight: 5}}/>
                          <Typography variant="h5">{station.machines.length}</Typography>
                        </Grid>
                        <Grid item={true} xs={4}>
                          <FontAwesomeIcon icon={faUser} style={{color: "black", float: 'left', marginRight: 5}}/>
                          <Typography variant="h5">{station.members.length}</Typography>
                        </Grid>
                        <Grid item={true} xs={4}>
                          <FontAwesomeIcon icon={faDatabase} style={{color: "black", float: 'left', marginRight: 5}}/>
                          <Typography variant="h5">{Object.keys(station.volumes).length}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
              )}) :
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
              </Grid>
        }
        </Grid>
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
