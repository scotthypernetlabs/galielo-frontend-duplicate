import React from 'react';
import { Machine } from '../../business/objects/machine';
import {Box, Grid, Typography} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSdCard, faTachometerAlt} from "@fortawesome/free-solid-svg-icons";
import {galileoTeal} from "../theme";

type Props = {
  machine: Machine;
}

type State = {

}

class LandingZone extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  public render(){
    const { machine } = this.props;
    let memory:number = 0;
    let cores:number = 0;
    if(machine.memory !== 'Unknown'){
      memory = parseInt((parseInt(machine.memory) / 1e9).toFixed(1));
    }
    const iconColor = machine.status.toUpperCase() === 'ONLINE' ? galileoTeal.main : "red";
    const borderColor = machine.status.toUpperCase() === 'ONLINE' ? "primary.main" : "red";
    const textColor = machine.status.toUpperCase() === 'ONLINE' ? "primary" : "error";
    return(
      <Box
        border="2px dashed"
        borderColor={borderColor}
        borderRadius={5}
        p={3}
        m={1}
        minWidth="250px"
        maxWidth="250px"
        minHeight="100px"
        maxHeight="100px"
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography color={textColor} variant="h4">{machine.machine_name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon icon={faSdCard} color={iconColor} style={{float: 'left', marginRight: 5}}/>
            <Typography color={textColor} variant="h5">{memory}GB</Typography>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon icon={faTachometerAlt} color={iconColor} style={{float: 'left', marginRight: 5}}/>
            <Typography color={textColor} variant="h5">{cores} Cores</Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

export default LandingZone;
