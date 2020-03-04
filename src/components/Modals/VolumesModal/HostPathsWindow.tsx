import { Button, TextField } from "@material-ui/core";
import { Dictionary } from "../../../business/objects/dictionary";
import { Machine } from "../../../business/objects/machine";
import { Station, Volume } from "../../../business/objects/station";
import Box from "@material-ui/core/Box";
import React from "react";
import SingleTextField from "../../Core/SingleTextField";

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

export const HostPathsWindow: React.SFC<HostPathsWindow> = (
  props: HostPathsWindow
) => {
  const {
    machines,
    station,
    modifyComplete,
    hostPathInput,
    selectedVolume,
    returnToVolumesView,
    handleHostPathInput,
    handleModifyHostPath
  } = props;
  return (
    <div className="volumes-modal-container">
      <div onClick={returnToVolumesView} className="add-cursor">
        <i className="far fa-chevron-left" />
      </div>
      <div className="volumes-modal-text">
        Host Paths are locations Landing Zones will check for data files when
        running jobs. Currently setting host paths for {selectedVolume.name}:
      </div>
      <div className="volumes-modal-list">
        {Object.keys(hostPathInput).map((mid: string, idx: number) => {
          if (station.machines.includes(mid)) {
            return (
              <div key={idx} className="volume-modal-volume">
                <div className="volume-modal-volume-details">
                  <div className="volume-name">
                    {machines[mid].machine_name}
                  </div>
                  <SingleTextField
                    textFieldLabel="Host Path"
                    textFieldPlaceholder="Enter in host path"
                    textFieldValue={hostPathInput[mid]}
                    onClick={handleModifyHostPath(
                      station.id,
                      selectedVolume,
                      mid,
                      hostPathInput[mid]
                    )}
                    onChange={handleHostPathInput(mid)}
                    buttonText={modifyComplete[mid] ? "Saved" : "Update"}
                    buttonDisabled={modifyComplete[mid]}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
