import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import { VolumeInput } from "./VolumesModal";
import React from "react";

interface VolumesInputForm {
  volumeInput: VolumeInput;
  handleVolumeInput: any;
  handleCheckbox: any;
}

export const VolumesInputForm: React.SFC<VolumesInputForm> = (
  props: VolumesInputForm
) => {
  const { volumeInput, handleVolumeInput, handleCheckbox } = props;
  return (
    <div>
      <TextField
        value={volumeInput.name}
        placeholder="Volume Name"
        variant="outlined"
        size="small"
        onChange={handleVolumeInput("name")}
      />
      <TextField
        value={volumeInput.mountPath}
        placeholder="Mount Path"
        variant="outlined"
        size="small"
        onChange={handleVolumeInput("mountPath")}
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
    </div>
  );
};
