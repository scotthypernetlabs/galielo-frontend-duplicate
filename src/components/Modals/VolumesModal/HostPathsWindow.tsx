import React from "react";
import {Button, Grid, TextField} from "@material-ui/core";
import {Dictionary} from "../../../business/objects/dictionary";
import {Machine} from "../../../business/objects/machine";
import {Station, Volume} from "../../../business/objects/station";

interface HostPathsWindow {
  machines: Dictionary<Machine>;
  station: Station;
  modifyComplete: Dictionary<boolean>;
  hostPathInput: Dictionary<string>;
  selectedVolume: Volume;
  returnToVolumesView: any;
  handleHostPathInput: any;
  handleModifyHostPath: any;
}

export const HostPathsWindow: React.SFC<HostPathsWindow> = (props) => {
  const {
    machines,
    station,
    modifyComplete,
    hostPathInput,
    selectedVolume,
    returnToVolumesView,
    handleHostPathInput,
    handleModifyHostPath,
  } = props;
  return(
    <div className="volumes-modal-container">
      <div onClick={returnToVolumesView} className="add-cursor">
        <i className="far fa-chevron-left"/>
      </div>
      <div className="volumes-modal-text">
        Host Paths are locations Landing Zones will check for data files when running jobs. Currently setting host paths for {selectedVolume.name}:
      </div>
      <div className="volumes-modal-list">
        {
          Object.keys(hostPathInput).map( (mid: string, idx: number) => {
            if(station.machines.includes(mid)) {
              return (
                <div key={idx} className="volume-modal-volume">
                  <div className="volume-modal-volume-details">
                    <div className="volume-name">
                      {machines[mid].machine_name}
                    </div>
                    <Grid container alignItems="center">
                      <Grid item xs={9}>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Enter in host path"
                          value={hostPathInput[mid]}
                          onChange={handleHostPathInput(mid)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        {<Button variant="contained"
                                 size="small"
                                 disabled={modifyComplete[mid]}
                                 color="primary"
                                 style={{width: "80px", height: "50px"}}
                                 onClick={handleModifyHostPath(station.id, selectedVolume, mid, hostPathInput[mid])}>
                          {modifyComplete[mid] ? 'Saved' : 'Update'}
                        </Button>}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    </div>
  )
};
