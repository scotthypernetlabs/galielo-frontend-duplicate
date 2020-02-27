import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField
} from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { VolumeInput } from "./VolumesModal";
import { VolumesInputForm } from "./VolumesInputForm";
import { VolumesList } from "./VolumesList";
import React from "react";

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

export const VolumesWindow: React.SFC<VolumesWindowProps> = (
  props: VolumesWindowProps
) => {
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

  return (
    <div className="volumes-modal-container">
      <div>
        <div className="volumes-modal-text">
          {station.volumes.length > 0
            ? "Please locate station volumes"
            : "No volumes in this station."}
        </div>
        <div onClick={closeModal} className="close-notifications add-cursor">
          <i className="fal fa-times" style={{ fontSize: 20 }} />
        </div>
      </div>
      <VolumesList
        station={station}
        handleHostPaths={handleHostPaths}
        handleRemoveVolume={handleRemoveVolume}
      />
      <div className="horizontal-line" />
      <VolumesInputForm
        volumeInput={volumeInput}
        handleVolumeInput={handleVolumeInput}
        handleCheckbox={handleCheckbox}
      />
      <div>{mountPathError && <div className="red">{errorText}</div>}</div>
      <div className="add-volume-button">
        <Button variant="contained" color="primary" onClick={handleAddVolume}>
          Add Volume
        </Button>
      </div>
    </div>
  );
};
