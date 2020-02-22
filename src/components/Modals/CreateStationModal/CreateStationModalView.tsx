import React from 'react';
import {Button, Checkbox, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
interface CreateStationModalProps {
    // e: any,
    stationName?: any,
    description?: any,
    charsLeft?: Number,
    helpMode?: any,
    handleChange?: any,
    MAX_CHAR?: Number,
    setVolumeState?: any,
    volumeScreen?: any,
    handleStationSubmit: any
    closeModal: any
}

const CreateStationModalView: React.SFC<CreateStationModalProps> = (props) => {
    
    return(
        <div className="create-station-modal-container">
        <Typography variant="h2" gutterBottom={true}>Create a Station</Typography>
        <Typography variant="h5" gutterBottom={true}>Please fill out the Station Details below.</Typography>
          <TextField
            value={props.stationName}
            onChange={(e) => props.handleChange(e, "stationName")}
            placeholder="Station Name"
            variant="outlined"
            size="small"
          />
          <TextField
            value={props.description}
            onChange={(e) => props.handleChange(e, "description")}
            rows="5"
            multiline
            placeholder="Description"
            variant="outlined"
            size="small"
          />
          <p className="group-description-textarea-counter">
            {props.charsLeft}/{props.MAX_CHAR}
          </p>
          <div className="attach-volumes-container">
            <div className="attach-volumes-text">
              <div> Attach Volumes? </div>
              <div className="hiw-text" onClick={props.setVolumeState(true, true)}>How does this work? </div>
            </div>
            <ToggleButtonGroup size = "small">
              <ToggleButton
                value="Yes"
                selected={props.volumeScreen && !props.helpMode}
                onClick={props.setVolumeState(true, false)}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                value="No"
                selected={!props.volumeScreen || props.helpMode}
                onClick={props.setVolumeState(false, false)}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="submit-buttons-container">
            <Button variant="outlined" onClick={props.closeModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={props.handleStationSubmit}
              disabled={props.stationName.length == 0}
            >
              Create Station
            </Button>
          </div>
      </div>
    )
}

export default CreateStationModalView;