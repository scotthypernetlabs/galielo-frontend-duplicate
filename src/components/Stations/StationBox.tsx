import React from "react";
import {Station} from "../../business/objects/station";
import {IReceiveSelectedStation, receiveSelectedStation} from "../../actions/stationActions";
import {Box, Grid, Typography} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChalkboard, faDatabase, faUser} from "@fortawesome/free-solid-svg-icons";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {IStore} from "../../business/objects/store";
import {linkYellow} from "../theme";

interface Props {
  pending: boolean;
  station: Station;
  handleOpenStation: (station: Station) => any;
  receiveSelectedStation: (station: Station) => IReceiveSelectedStation;
}

type State = {
}

class StationBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(){
    const { station, pending } = this.props;
    return(
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
        onClick={this.props.handleOpenStation(station)}
        key={station.id}
      >
        <Grid container>
          <Grid item xs={12}>
            { pending ?
              <Typography gutterBottom variant="h3" style={{color: linkYellow.main}}>{station.name}</Typography> :
              <Typography gutterBottom variant="h3" color="primary">{station.name}</Typography>
            }
          </Grid>
          <Grid item xs={4}>
            <FontAwesomeIcon icon={faChalkboard} style={{color: "black", float: 'left', marginRight: 5}}/>
            <Typography variant="h5">{station.machines.length}</Typography>
          </Grid>
          <Grid item xs={4}>
            <FontAwesomeIcon icon={faUser} style={{color: "black", float: 'left', marginRight: 5}}/>
            <Typography variant="h5">{station.members.length}</Typography>
          </Grid>
          <Grid item xs={4}>
            <FontAwesomeIcon icon={faDatabase} style={{color: "black", float: 'left', marginRight: 5}}/>
            <Typography variant="h5">{Object.keys(station.volumes).length}</Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveSelectedStation: (station: Station) => dispatch(receiveSelectedStation(station)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationBox);
