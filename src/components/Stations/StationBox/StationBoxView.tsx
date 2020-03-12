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
  handleDragLeave:any;
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
    handleDragLeave,
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
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={0.75}
      >
        <Box mr={3}>
          <IconText
            icon="tv"
            text={station.machines.length.toString()}
            textVariant="h5"
            iconSize={18}
          />
        </Box>
        <Box mr={3}>
          <IconText
            icon="person"
            text={station.members.length.toString()}
            textVariant="h5"
            iconSize={18}
          />
        </Box>
        <Box mr={3}>
          <IconText
            icon="storage"
            text={Object.keys(station.volumes).length.toString()}
            textVariant="h5"
            iconSize={18}
          />
        </Box>
      </Box>
    );
  };

  return (
    <div
      onClick={handleOpenStation}
      key={station.id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
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
        <Box display="flex" flexDirection="column">
          <Box width="100%">
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
          </Box>
          {!pending && (
            <BoxHover
              hover={hover}
              handleOpenStation={handleOpenStation}
              handleRunJobClick={handleRunJobClick}
            />
          )}
          {stationDetails(station)}
          <Box>
            <ProgressBar type={"station"} id={station.id} />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default StationBoxView;
