import { Box, Grid, Typography } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import {
  faChalkboard,
  faDatabase,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { linkYellow } from "../../theme";
import BoxHover from "../../Core/BoxHover";
import IconText from "../../Core/IconText";
import ProgressBar from "../../ProgressBar";
import React from "react";

interface StationBoxViewProps {
  station: Station;
  handleOpenStation: any;
  handleDragOver: any;
  handleDrop: any;
  handleMouseOver: any;
  handleMouseOut: any;
  handleRunJobClick: any;
  hover: boolean;
  dragOver: boolean;
  fileUpload: boolean;
  fileUploadText: string;
  pending: boolean;
}

const StationBoxView: React.SFC<StationBoxViewProps> = (
  props: StationBoxViewProps
) => {
  const {
    handleOpenStation,
    station,
    handleDragOver,
    handleDrop,
    handleMouseOut,
    handleMouseOver,
    hover,
    handleRunJobClick,
    dragOver,
    fileUpload,
    fileUploadText,
    pending
  } = props;

  const stationDetails = (station: Station) => {
    if (fileUpload || dragOver) {
      return (
        <Grid item xs={12}>
          <h5>{fileUploadText}</h5>
        </Grid>
      );
    }
    return (
      <>
        <Grid item={true} xs={4}>
          <IconText
            icon={faChalkboard}
            text={station.machines.length.toString()}
            textVariant="h5"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <IconText
            icon={faUser}
            text={station.members.length.toString()}
            textVariant="h5"
          />
        </Grid>
        <Grid item={true} xs={4}>
          <IconText
            icon={faDatabase}
            text={Object.keys(station.volumes).length.toString()}
            textVariant="h5"
          />
        </Grid>
      </>
    );
  };

  return (
    <div
      onClick={handleOpenStation}
      key={station.id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Box
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
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
      >
        <Grid container>
          <Grid item xs={12}>
            {pending ? (
              <Typography
                gutterBottom
                variant="h3"
                style={{ color: linkYellow.main }}
              >
                {station.name}
              </Typography>
            ) : (
              <Typography gutterBottom variant="h3" color="primary">
                {station.name}
              </Typography>
            )}
          </Grid>
          {!pending && (
            <BoxHover
              hover={hover}
              handleOpenStation={handleOpenStation}
              handleRunJobClick={handleRunJobClick}
            />
          )}
          {stationDetails(station)}
          <Grid item xs={12}>
            <ProgressBar type={"station"} id={station.id} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default StationBoxView;
