import React from "react";
import {Button, Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import {Station} from "../../../business/objects/station";
import {VolumeInput} from "./VolumesModal";
import {VolumesList} from "./VolumesList";

interface VolumesWindowProps {
  volumeInput: VolumeInput;
  station: Station;
  mountPathError: boolean;
  errorText: string;
  closeModal: any;
  handleHostPaths: any;
  handleRemoveVolume: any;
  handleVolumeInput: any;
  handleCheckbox: any;
  handleAddVolume: any;
}

export const VolumesWindow: React.SFC<VolumesWindowProps> = (props) => {
  const {
    station,
    volumeInput,
    closeModal,
    handleHostPaths,
    handleRemoveVolume,
    handleVolumeInput,
    handleCheckbox,
    mountPathError,
    errorText,
    handleAddVolume
  } = props;

  return(
    <div className="volumes-modal-container">
      <div>
        <div className="volumes-modal-text">
          {
            station.volumes.length > 0 ?
              'Please locate station volumes' :
              'No volumes in this station.'
          }
        </div>
        <div onClick={closeModal} className="close-notifications add-cursor">
          <i className="fal fa-times"/>
        </div>
      </div>
      <VolumesList station={station} handleHostPaths={handleHostPaths} handleRemoveVolume={handleRemoveVolume}/>
      <div className="horizontal-line"/>
      <TextField
        value={volumeInput.name}
        placeholder="Volume Name"
        variant="outlined"
        size="small"
        onChange={handleVolumeInput('name')}
      />
      <TextField
        value={volumeInput.mountPath}
        placeholder="Mount Path"
        variant="outlined"
        size="small"
        onChange={handleVolumeInput('mountPath')}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="writePermissions"
            onChange={handleCheckbox}
            checked={volumeInput.writePermissions}
          />
        }
        label="Write Access"
      />
      <div>
      {
        mountPathError &&
        <div className="red">
          {errorText}
        </div>
      }
      </div>
      <div className="add-volume-button">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddVolume}
        >
          Add Volume
        </Button>
      </div>
    </div>
  )
};
