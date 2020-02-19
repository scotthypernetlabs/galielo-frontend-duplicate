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
import { getDroppedOrSelectedFiles } from './fileSelector';
import { PackagedFile } from '../../business/objects/packagedFile';
import StationBox from './StationBox';

const fileUploadTextDefault = 'Browse or drop directory';

interface Props extends RouteComponentProps<any> {
  stations: Dictionary<Station>;
  currentUser: User;
  openCreateStation: () => IOpenModal;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}

type State = {
  dragOver: boolean;
  disabled: boolean;
  fileUploadText: string;
  fileUpload: boolean;
}

class Stations extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      dragOver: false,
      disabled: false,
      fileUploadText: fileUploadTextDefault,
      fileUpload: false
    }
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.stationDetails = this.stationDetails.bind(this);
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
  handleDragOver(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    if(disabled) return;
    this.setState({
      fileUploadText: 'Drop to send a directory',
      dragOver: true
    })
  }
  handleDragLeave(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    if(disabled) return;
    this.setState({
      fileUploadText: fileUploadTextDefault,
      dragOver: false
    })
  }
  async handleDrop(e: React.DragEvent<HTMLDivElement>, station: Station){
    e.preventDefault();
    e.stopPropagation();
    const { disabled } = this.state;
    if(disabled) return;
    this.setState({
      disabled: true,
      fileUploadText: 'Uploading your file.....',
      fileUpload: true
    })
    let directoryName = e.dataTransfer.files[0].name;
    let files = await getDroppedOrSelectedFiles(e);
    files = files.map( (file: PackagedFile) => {
      let path = file.fullPath.replace(`${directoryName}/`, '');
      return Object.assign({}, file, {fullPath: path.slice(1)})
    })
    let jobUploaded = await this.context.jobService.sendStationJob(station.id, files, directoryName)
    this.setState({
      fileUploadText: fileUploadTextDefault,
      disabled: false,
      fileUpload: false
    })
  }
  stationDetails(station: Station){
    if(this.state.fileUpload || this.state.dragOver){
      return(
        <Grid item xs={12}>
        <h5>{this.state.fileUploadText}</h5>
        </Grid>
      )
    }
    return(
      <>
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
      </>
    )
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
                <StationBox key={idx} station={station} history={this.props.history}/>
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
