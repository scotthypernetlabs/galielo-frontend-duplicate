import {Station} from "../../../business/objects/station";
import React from "react";
import {Button} from "@material-ui/core";

interface VolumesList {
  station: Station;
  handleHostPaths: any;
  handleRemoveVolume: any;
}

export const VolumesList: React.SFC<VolumesList> = (props) => {
  const { station, handleHostPaths, handleRemoveVolume } = props;
  return (
    <div className="volumes-modal-list">
      {station.volumes.map((volume, idx) => {
        return (
          <div key={idx} className="volume-modal-volume">
            <div className="volume-modal-volume-details">
              <div className="volume-name">
                {volume.name}
              </div>
              <div className="volume-path">
                {volume.mount_point}
              </div>
              <div className="volume-access">
                {volume.access === 'rw' ? 'Read & Write' : 'Read Only'}
              </div>
            </div>
            <Button variant="outlined" onClick={handleHostPaths(volume)}>
              Host Paths
            </Button>
            <div className="add-cursor">
              <i className="delete-btn fas fa-trash-alt" onClick={handleRemoveVolume(volume.volume_id)}/>
            </div>
          </div>
        )
      })}
    </div>
  )
};
