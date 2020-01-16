import React from 'react';
import { Machine } from '../../business/objects/machine';

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
    let machineClass = 'file-upload-machine';
    if(machine.status.toUpperCase() !== 'ONLINE'){
      machineClass += ' red';
    }
    let memory:number = 0;
    let cores:number = 0;
    if(machine.memory !== 'Unknown'){
      memory = parseInt((parseInt(machine.memory) / 1e9).toFixed(1));
    }
    // if(machine.nproc !== 'Unknown'){
    //   cores = parseInt(machine.nproc);
    // }
    return(
      <div className={machineClass}>
        <div>{machine.machine_name}</div>
        <div className="machine-details-icons">
          <i className="fas fa-sd-card">
            <div>{memory}GB</div>
          </i>
          <i className="fas fa-tachometer-fast">
            <div>{cores} Cores  </div>
          </i>
        </div>
      </div>
    )
  }
}

export default LandingZone;
